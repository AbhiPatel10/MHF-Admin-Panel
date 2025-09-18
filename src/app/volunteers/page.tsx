'use client';

import * as React from 'react';
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import dayjs from "dayjs";

import {
  getVolunteersApi,
  deleteVolunteerApi,
} from '@/services/volunteerService';
import { TGetAllVolunteers } from '@/utils/types/volunteers.types';
import { Label } from '@/components/ui/label';

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = React.useState<TGetAllVolunteers[] | []>([]);
  const [total, setTotal] = React.useState<number>(0);
  // const [page, setPage] = React.useState<number>(1);
  const [offset, setOffset] = React.useState<number>(0);
  const [limit] = React.useState<number>(10);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch volunteers
  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getVolunteersApi(offset, limit);
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
  }, [offset, limit]);

  // Delete handler
  const handleDelete = async (volunteerId: string) => {
    try {
      await deleteVolunteerApi(volunteerId);
      setVolunteers((prev) =>
        prev.filter((volunteer) => volunteer._id !== volunteerId)
      );
      setTotal((prev) => prev - 1);
    } catch (err: any) {
      alert(err.message || 'Failed to delete volunteer');
    }
  };

  return (
    <AppLayout>
      <main className="p-4 md:p-6">
        <PageHeader
          title="Volunteers"
          description="Manage your team of dedicated volunteers."
        >
          <Button asChild>
            <Link href="/volunteers/new">
              <PlusCircle className="mr-2" />
              Add Volunteer
            </Link>
          </Button>
        </PageHeader>

        <Card>
          <CardHeader>
            <CardTitle>
              All Volunteers {loading && '(Loading...)'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <p className="text-red-500 mb-3">{error}</p>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Occupation</TableHead>
                  <TableHead>Birth Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {volunteers.length > 0 ? (
                  volunteers.map((volunteer: TGetAllVolunteers) => (
                    <TableRow key={volunteer._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={volunteer?.image?.url}
                              alt={volunteer?.name}
                            />
                            <AvatarFallback>
                              {volunteer.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {volunteer.name}
                        </div>
                      </TableCell>
                      {/* <TableCell>{volunteer.e}</TableCell> */}
                      <TableCell>{volunteer?.phoneNo ?? "-"}</TableCell>
                      <TableCell>{volunteer?.occupation}</TableCell>
                      <TableCell>{dayjs(volunteer?.birthdate).format("YYYY-MM-DD")}</TableCell>
                      <TableCell>{<Label>{volunteer?.isActive ? "Active" : "Inactive"} </Label>}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/volunteers/new/${volunteer._id}`}>Edit</Link>
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-destructive"
                                >
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the volunteer's record.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(volunteer._id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      {loading ? 'Loading...' : 'No volunteers found'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-500">
                Showing {total > 0 ? offset + 1 : 0}–
                {total > 0 ? Math.min(offset + limit, total) : 0} of {total} volunteers
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={offset === 0}
                  onClick={() => setOffset((prev) => Math.max(prev - limit, 0))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={offset + limit >= total}
                  onClick={() => setOffset((prev) => prev + limit)}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </AppLayout>
  );
}
