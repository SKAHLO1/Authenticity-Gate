import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateVerificationInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useVerifications() {
  return useQuery({
    queryKey: [api.verifications.list.path],
    queryFn: async () => {
      const res = await fetch(api.verifications.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch verifications");
      return api.verifications.list.responses[200].parse(await res.json());
    },
  });
}

export function useVerification(id: number) {
  return useQuery({
    queryKey: [api.verifications.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.verifications.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) throw new Error("Verification not found");
      if (!res.ok) throw new Error("Failed to fetch verification");
      return api.verifications.get.responses[200].parse(await res.json());
    },
    // Poll every 3 seconds if status is pending or processing
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && (data.status === 'pending' || data.status === 'processing')) {
        return 3000;
      }
      return false;
    }
  });
}

export function useCreateVerification() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateVerificationInput) => {
      const res = await fetch(api.verifications.create.path, {
        method: api.verifications.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.verifications.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create verification");
      }
      return api.verifications.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.verifications.list.path] });
      toast({
        title: "Verification Started",
        description: "Your content is now being analyzed by GenLayer.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
