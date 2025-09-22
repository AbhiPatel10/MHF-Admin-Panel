'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  PlusCircle,
  Calendar as CalendarIcon,
  MapPin,
  Users,
  Edit,
  Trash2,
} from 'lucide-react';

import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

import { deleteEventApi, getAllEventsApi } from '@/services/eventService';
import { useToast } from '@/hooks/use-toast';

export default function EventsPage() {
  const { toast } = useToast();
  const [events, setEvents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  // UI state
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterCategory, setFilterCategory] = React.useState('all');
  const [sortOrder, setSortOrder] = React.useState('date-desc');
  const [eventToDelete, setEventToDelete] = React.useState<any | null>(null);

  // pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 6;

  const categories = [
    { id: 'workshop', name: 'Workshop' },
    { id: 'seminar', name: 'Seminar' },
    { id: 'fundraiser', name: 'Fundraiser' },
  ];

  // fetch events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await getAllEventsApi();
      if (res.status === 200) {
        setEvents(res.data);
      } else {
        toast({
          title: 'Error',
          description: res.message,
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to load events',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEvents();
  }, []);

  // delete handler
  const handleDelete = async (eventId: string) => {
    try {
      const res = await deleteEventApi(eventId);
      if (res.status === 200) {
        fetchEvents();
        toast({
          title: 'Deleted!',
          description: res.message || 'Event deleted successfully.',
        });
      } else {
        toast({
          title: 'Error',
          description: res.message || 'Failed to delete event',
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete event',
        variant: 'destructive',
      });
    } finally {
      setEventToDelete(null);
    }
  };

  // filter + search + sort
  const filteredEvents = events
    .filter((event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((event) =>
      filterCategory === 'all' ? true : event.category === filterCategory
    )
    .sort((a, b) => {
      if (sortOrder === 'date-desc') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortOrder === 'date-asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortOrder === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortOrder === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });

  // pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <AppLayout>
      <main className="p-4 md:p-6">
        <PageHeader
          title="Events"
          description="Manage your organization's events and workshops."
        >
          <Button asChild>
            <Link href="/events/new">
              <PlusCircle className="mr-2" />
              New Event
            </Link>
          </Button>
        </PageHeader>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="max-w-xs"
              />
              <div className="flex gap-4">
                <Select
                  value={filterCategory}
                  onValueChange={(value) => {
                    setFilterCategory(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Date (Newest)</SelectItem>
                    <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Event Grid */}
        {loading ? (
          <p>Loading events...</p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedEvents.map((event) => (
                <Card key={event._id} className="group flex flex-col overflow-hidden">
                  <div className="relative aspect-video w-full">
                    <Image
                      src={event.imageUrl || '/placeholder.webp'}
                      alt={event.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <CardHeader className="flex-grow">
                    <CardTitle className="text-lg font-bold leading-tight">
                      <Link href="#" className="hover:underline">
                        {event.name}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-sm text-primary">
                      {event.category || 'Uncategorized'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span>
                        {event.date ? format(new Date(event.date), 'PPP') : '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{event.attendees || 0} attendees</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 p-4 pt-0">
                    <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        asChild
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Link href={`/events/new/${event._id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog
                        open={!!eventToDelete && eventToDelete._id === event._id}
                        onOpenChange={(isOpen) =>
                          !isOpen && setEventToDelete(null)
                        }
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setEventToDelete(event)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently
                              delete the event.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() => setEventToDelete(null)}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(event._id)}
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

            {paginatedEvents.length === 0 && (
              <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <h3 className="text-2xl font-bold tracking-tight">
                  No events found
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your search or filters.
                </p>
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
                        className={
                          currentPage === 1
                            ? 'pointer-events-none opacity-50'
                            : ''
                        }
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
                        className={
                          currentPage === totalPages
                            ? 'pointer-events-none opacity-50'
                            : ''
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </main>
    </AppLayout>
  );
}
