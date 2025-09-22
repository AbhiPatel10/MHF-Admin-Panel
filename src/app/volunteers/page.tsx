'use client';

import * as React from 'react';
import dayjs from "dayjs";
import Link from 'next/link';
import {
  Inbox, PlusCircle, Mail, Phone, Calendar,
  Edit, Trash2
} from 'lucide-react';

import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationPrevious, PaginationNext
} from "@/components/ui/pagination";

import { getVolunteersApi, deleteVolunteerApi } from '@/services/volunteerService';
import { TGetAllVolunteers } from '@/utils/types/volunteers.types';

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = React.useState<TGetAllVolunteers[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [offset, setOffset] = React.useState<number>(0);
  const [limit] = React.useState<number>(8); // grid looks better with 8 per page
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [volunteerToDelete, setVolunteerToDelete] = React.useState<TGetAllVolunteers | null>(null);

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  // Fetch volunteers
  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getVolunteersApi(offset, limit, searchTerm); // ensure API supports search
      if (res.status === 200) {
        setVolunteers(res.data.volunteers ?? []);
        setTotal(res.data.totalCount);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch volunteers');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchVolunteers();
  }, [offset, limit, searchTerm]);

  // Delete handler
  const handleDelete = async (volunteerId: string) => {
    try {
      await deleteVolunteerApi(volunteerId);
      setVolunteers((prev) => prev.filter((v) => v._id !== volunteerId));
      setTotal((prev) => prev - 1);
      setVolunteerToDelete(null);
      fetchVolunteers();
    } catch (err: any) {
      alert(err.message || 'Failed to delete volunteer');
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setOffset((page - 1) * limit);
    }
  };

  return (
    <AppLayout>
      <main className="p-4 md:p-6">
        <PageHeader
          title="Volunteers"
          description="Manage your team of dedicated volunteers."
        >
          <Button variant="outline" asChild>
            <Link href="/volunteers/requests">
              <Inbox className="mr-2" />
              View Requests
            </Link>
          </Button>
          <Button asChild>
            <Link href="/volunteers/new">
              <PlusCircle className="mr-2" />
              Add Volunteer
            </Link>
          </Button>
        </PageHeader>

        <Card className="mb-6">
          <CardContent className="p-4">
            <Input
              placeholder="Search volunteers by name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setOffset(0);
              }}
              className="max-w-sm"
            />
          </CardContent>
        </Card>

        {/* Volunteers Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {volunteers.map((volunteer) => (
            <Card key={volunteer._id} className="group flex flex-col overflow-hidden text-center">
              <CardHeader>
                <div className="relative mx-auto">
                  <Avatar className="mx-auto h-24 w-24 border-4 border-background">
                    <AvatarImage
                      src={volunteer?.image?.url}
                      alt={volunteer.name}
                    />
                    <AvatarFallback className="text-3xl">
                      {volunteer.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="mt-4 text-xl font-bold">
                  {volunteer.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="mt-auto flex-grow space-y-3">
                {volunteer?.phoneNo && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{volunteer.phoneNo}</span>
                  </div>
                )}
                {volunteer?.occupation && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{volunteer.occupation}</span>
                  </div>
                )}
                {volunteer?.birthdate && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Birth: {dayjs(volunteer.birthdate).format("YYYY-MM-DD")}
                    </span>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-center gap-2 p-4 pt-0">
                <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button asChild variant="outline" size="icon" className="h-8 w-8">
                    <Link href={`/volunteers/new/${volunteer._id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>

                  <AlertDialog
                    open={!!volunteerToDelete && volunteerToDelete._id === volunteer._id}
                    onOpenChange={(isOpen) => !isOpen && setVolunteerToDelete(null)}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setVolunteerToDelete(volunteer)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the volunteer's record.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setVolunteerToDelete(null)}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(volunteer._id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {!loading && volunteers.length === 0 && (
          <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h3 className="text-2xl font-bold tracking-tight">No volunteers found</h3>
            <p className="mt-2 text-muted-foreground">Try adjusting your search.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="p-2 text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
    </AppLayout>
  );
}
