import { useState, useEffect, useRef } from "react"
import { useGetUserProfile, useUpdateUserProfile } from "@workspace/api-client-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
// toast: simple inline fallback
const useToast = () => ({ toast: (opts: { title?: string; description?: string }) => { console.info("[toast]", opts.title, opts.description) } })
import { StreakBadge } from "@/components/StreakBadge"
import { User, Mail, GraduationCap, Calendar, Save, Camera, Edit2, Trophy } from "lucide-react"
import { format } from "date-fns"

export default function Profile() {
  const { data: profile, isLoading } = useGetUserProfile()
  const updateUser = useUpdateUserProfile()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  
  // Form state
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [educationLevel, setEducationLevel] = useState("")

  const initRef = useRef<number | null>(null)

  useEffect(() => {
    if (profile && initRef.current !== profile.id) {
      initRef.current = profile.id;
      setName(profile.name || "");
      setBio(profile.bio || "");
      setEducationLevel(profile.educationLevel || "");
    }
  }, [profile])

  const handleSave = () => {
    updateUser.mutate({
      data: { name, bio, educationLevel }
    }, {
      onSuccess: () => {
        setIsEditing(false)
        toast({ title: "Profile updated successfully" })
      },
      onError: () => {
        toast({ title: "Failed to update profile", description: "Please try again." })
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex-1 p-6 lg:p-12 max-w-5xl mx-auto w-full space-y-8">
        <Skeleton className="h-64 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-96 md:col-span-1 rounded-3xl" />
          <Skeleton className="h-96 md:col-span-2 rounded-3xl" />
        </div>
      </div>
    )
  }

  if (!profile) return <div className="p-10 text-center">Failed to load profile</div>

  return (
    <div className="flex-1 overflow-y-auto bg-muted/10 p-6 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Banner & Avatar */}
        <div className="relative rounded-3xl bg-card border overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-primary to-blue-500"></div>
          <div className="px-8 pb-8 flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 relative z-10">
            <div className="relative group">
              <Avatar className="w-32 h-32 border-4 border-card shadow-xl">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="text-4xl">{profile.name[0]}</AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors opacity-0 group-hover:opacity-100">
                <Camera size={18} />
              </button>
            </div>
            
            <div className="flex-1 text-center sm:text-left pt-16 sm:pt-0 pb-2">
              <h1 className="text-3xl font-display font-bold">{profile.name}</h1>
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 mt-2">
                <Badge variant="secondary" className="uppercase tracking-wider">{profile.role}</Badge>
                <span className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
                  <Calendar size={14} /> Joined {format(new Date(profile.joinedAt), 'MMM yyyy')}
                </span>
              </div>
            </div>
            
            <div className="pb-2">
              <Button 
                variant={isEditing ? "default" : "outline"} 
                className="rounded-full gap-2"
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                disabled={updateUser.isPending}
              >
                {isEditing ? <><Save size={16} /> Save Changes</> : <><Edit2 size={16} /> Edit Profile</>}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Stats Column */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Learning Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Level</p>
                    <p className="text-2xl font-bold font-display">{profile.level}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                    <Trophy size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total XP</p>
                    <p className="text-2xl font-bold font-display">{profile.xp.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center">
                    <StreakBadge streak={profile.streak} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Day Streak</p>
                    <p className="text-2xl font-bold font-display">{profile.streak}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details Column */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Details</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Display Name</label>
                      <Input 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="max-w-md"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Bio</label>
                      <textarea 
                        className="w-full h-32 rounded-xl border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        placeholder="Tell us about your learning goals..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Education Level</label>
                      <Input 
                        value={educationLevel} 
                        onChange={e => setEducationLevel(e.target.value)} 
                        className="max-w-md"
                        placeholder="e.g. University Student"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <Mail className="text-muted-foreground mt-0.5 shrink-0" size={20} />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Email Address</p>
                        <p className="font-medium">{profile.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <GraduationCap className="text-muted-foreground mt-0.5 shrink-0" size={20} />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Education Level</p>
                        <p className="font-medium">{profile.educationLevel || <span className="italic opacity-50">Not specified</span>}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <User className="text-muted-foreground mt-0.5 shrink-0" size={20} />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">About Me</p>
                        <p className="font-medium leading-relaxed max-w-2xl">
                          {profile.bio || <span className="italic opacity-50">No bio provided. Click edit to tell the community about your goals.</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}
