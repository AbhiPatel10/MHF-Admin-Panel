'use client';

import * as React from 'react';
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { TeamMemberSection } from './TeamMemberSectionCard';
import { getAllTeamMembersApi } from '@/services/teamMemberService';
import { TGetAllTeamMembers } from '@/utils/types/teamMemberTypes';

export default function TeamMembersPage() {
  const [teamMembers, setTeamMembers] = React.useState<TGetAllTeamMembers[]>([]);
  const [memberToDelete, setMemberToDelete] = React.useState<TGetAllTeamMembers | null>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchTeamMembers = async () => {
    setIsLoading(true);
    try {
      const assetsRes = await getAllTeamMembersApi(0, 0, "", 'Asset');
      const keyMembersRes = await getAllTeamMembersApi(0, 0, "", 'Key Member');

      setTeamMembers([
        ...(assetsRes.data.teamMembers || []),
        ...(keyMembersRes.data.teamMembers || []),
      ]);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.message || 'Failed to fetch team members',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTeamMembers();
  }, []);

  const assets = teamMembers.filter((m) => m.memberType === 'Asset');
  const keyMembers = teamMembers.filter((m) => m.memberType === 'Key Member');

  const handleDelete = (memberId: string) => {
    setTeamMembers((prev) => prev.filter((member) => member._id !== memberId));
    setMemberToDelete(null);
    toast({
      title: 'Member Deleted',
      description: 'The team member has been successfully removed.',
    });
  };

  return (
    <AppLayout>
      <main className="p-4 md:p-6 lg:p-12">
        <PageHeader title="Team Members" description="Manage your team of dedicated members.">
          <Button asChild>
            <Link href="/team-members/new">
              <PlusCircle className="mr-2" />
              Add Member
            </Link>
          </Button>
        </PageHeader>

        <Card className="p-6 md:p-8">
          {isLoading ? (
            <p>Loading team members...</p>
          ) : (
            <div className="space-y-16">
              <TeamMemberSection
                title="Our Assets"
                description="The dedicated team that drives our success."
                members={assets}
                onDelete={setMemberToDelete}
              />
              <TeamMemberSection
                title="Our Key Members"
                description="The dedicated individuals who form the backbone of our organization."
                members={keyMembers}
                onDelete={setMemberToDelete}
              />
            </div>
          )}
        </Card>
      </main>

      <AlertDialog
        open={!!memberToDelete}
        onOpenChange={(isOpen) => !isOpen && setMemberToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the team member's record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMemberToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(memberToDelete!._id)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
