import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TeamMember } from "@/lib/types";
import { TGetAllTeamMembers } from "@/utils/types/teamMemberTypes";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export function TeamMemberSection({
    title,
    description,
    members,
    onDelete,
}: {
    title: string;
    description: string;
    members: TGetAllTeamMembers[];
    onDelete: (member: TGetAllTeamMembers) => void;
}) {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold">{title}</h2>
                <p className="text-muted-foreground">{description}</p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {members.map((member) => (
                    <div key={member._id} className="group relative text-center">
                        <div className="relative mx-auto mb-4 h-24 w-24">
                            <Avatar className="h-full w-full">
                                <AvatarImage src={member.image?.url} alt={member.name} data-ai-hint="person" />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                <Button asChild variant="outline" size="icon" className="h-8 w-8">
                                    <Link href={`/team-members/new/${member._id}`}>
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => onDelete(member)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-primary">{member.role}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}