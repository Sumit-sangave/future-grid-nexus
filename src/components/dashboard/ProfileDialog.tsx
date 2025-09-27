import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Phone, MapPin, Building2, Shield, Settings } from 'lucide-react';
import { z } from 'zod';

const profileSchema = z.object({
  full_name: z.string().trim().min(2, { message: "Full name must be at least 2 characters" }).max(100, { message: "Full name must be less than 100 characters" }),
  contact_number: z.string().trim().min(10, { message: "Contact number must be at least 10 characters" }).max(20, { message: "Contact number must be less than 20 characters" }).optional().or(z.literal('')),
  address: z.string().trim().max(200, { message: "Address must be less than 200 characters" }).optional().or(z.literal('')),
  department: z.string().trim().max(100, { message: "Department must be less than 100 characters" }).optional().or(z.literal(''))
});

export const ProfileDialog = () => {
  const { profile, updateProfile, switchRole } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  if (!profile) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      full_name: formData.get('full_name') as string,
      contact_number: formData.get('contact_number') as string,
      address: formData.get('address') as string,
      department: formData.get('department') as string
    };

    try {
      const result = profileSchema.safeParse(data);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }

      const { error } = await updateProfile(data);
      if (!error) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSwitch = async (newRole: 'admin' | 'technician') => {
    setIsLoading(true);
    const { error } = await switchRole(newRole);
    if (!error) {
      setIsEditing(false);
    }
    setIsLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <User className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Profile Settings</span>
          </DialogTitle>
          <DialogDescription>
            Manage your account information and preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                {profile.role === 'admin' ? (
                  <Shield className="w-6 h-6 text-primary" />
                ) : (
                  <Settings className="w-6 h-6 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">{profile.full_name}</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                    {profile.role}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  defaultValue={profile.full_name}
                  className={errors.full_name ? 'border-destructive' : ''}
                />
                {errors.full_name && (
                  <p className="text-sm text-destructive">{errors.full_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_number">Contact Number</Label>
                <Input
                  id="contact_number"
                  name="contact_number"
                  defaultValue={profile.contact_number || ''}
                  placeholder="+1 234 567 8900"
                  className={errors.contact_number ? 'border-destructive' : ''}
                />
                {errors.contact_number && (
                  <p className="text-sm text-destructive">{errors.contact_number}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  name="department"
                  defaultValue={profile.department || ''}
                  placeholder="Engineering, Administration, etc."
                  className={errors.department ? 'border-destructive' : ''}
                />
                {errors.department && (
                  <p className="text-sm text-destructive">{errors.department}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  defaultValue={profile.address || ''}
                  placeholder="College campus address"
                  className={errors.address ? 'border-destructive' : ''}
                />
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Role Switch</Label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={profile.role === 'admin' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleRoleSwitch('admin')}
                    disabled={isLoading || profile.role === 'admin'}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                  <Button
                    type="button"
                    variant={profile.role === 'technician' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleRoleSwitch('technician')}
                    disabled={isLoading || profile.role === 'technician'}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Technician
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </div>
                  <p className="font-medium">{profile.email}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>Contact</span>
                  </div>
                  <p className="font-medium">{profile.contact_number || 'Not provided'}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span>Department</span>
                  </div>
                  <p className="font-medium">{profile.department || 'Not specified'}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>Address</span>
                  </div>
                  <p className="font-medium">{profile.address || 'Not provided'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};