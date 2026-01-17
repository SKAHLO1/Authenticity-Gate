import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateVerificationInput } from "@shared/routes";
import { type Verification } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";

export function useVerifications() {
  return useQuery({
    queryKey: [api.verifications.list.path],
    queryFn: async () => {
      return apiRequest(api.verifications.list.path);
    },
  });
}

export function useVerification(id: string) {
  return useQuery<Verification>({
    queryKey: [api.verifications.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.verifications.get.path, { id });
      return apiRequest(url);
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
      return apiRequest(api.verifications.create.path, {
        method: api.verifications.create.method,
        body: JSON.stringify(data),
      });
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
