import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Shield, Camera } from 'lucide-react';

export default function Profile() {
    const { currentUser } = useAuth();
    const { toast } = useToast();
    const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
    const [isEditing, setIsEditing] = useState(false);

    const handleSaveProfile = async () => {
        try {
            // TODO: Implement profile update with Firebase
            // await updateProfile(currentUser!, { displayName });
            toast({
                title: 'Profile Updated',
                description: 'Your profile has been successfully updated.',
            });
            setIsEditing(false);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update profile',
                variant: 'destructive',
            });
        }
    };

    if (!currentUser) return null;

    const initials = currentUser.email
        ? currentUser.email.substring(0, 2).toUpperCase()
        : 'U';

    return (
        <Layout>
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-display font-bold mb-2">Profile</h1>
                    <p className="text-muted-foreground">Manage your account settings and preferences</p>
                </div>

                <div className="grid gap-6">
                    {/* Profile Picture Card */}
                    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.email || 'User'} />
                                    <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                                </Avatar>
                                <button className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera className="w-6 h-6 text-white" />
                                </button>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-display font-bold mb-1">
                                    {currentUser.displayName || 'User'}
                                </h2>
                                <p className="text-muted-foreground">{currentUser.email}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Account Information */}
                    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-display font-semibold flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Account Information
                            </h3>
                            {!isEditing && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit Profile
                                </Button>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="displayName">Display Name</Label>
                                <Input
                                    id="displayName"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    disabled={!isEditing}
                                    placeholder="Enter your display name"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        value={currentUser.email || ''}
                                        disabled
                                        className="flex-1"
                                    />
                                    {currentUser.emailVerified && (
                                        <div className="flex items-center gap-1 text-green-600 text-sm">
                                            <Shield className="w-4 h-4" />
                                            Verified
                                        </div>
                                    )}
                                </div>
                            </div>

                            {isEditing && (
                                <div className="flex gap-2 pt-4">
                                    <Button onClick={handleSaveProfile}>
                                        Save Changes
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setDisplayName(currentUser.displayName || '');
                                            setIsEditing(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Account Stats */}
                    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                        <h3 className="text-xl font-display font-semibold mb-4">Account Status</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/10">
                                <div className="text-3xl font-bold text-primary mb-1">—</div>
                                <div className="text-sm text-muted-foreground">Verifications</div>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
                                <div className="text-3xl font-bold text-blue-600 mb-1">Free</div>
                                <div className="text-sm text-muted-foreground">Plan Type</div>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-green-500/5 border border-green-500/10">
                                <div className="text-3xl font-bold text-green-600 mb-1">Active</div>
                                <div className="text-sm text-muted-foreground">Status</div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
