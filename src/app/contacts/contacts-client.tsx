'use client';

import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { getAllContactsApi, updateContactStatusApi, deleteContactApi, TContact } from '@/services/contactService';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

export function ContactsClient() {
  const [contacts, setContacts] = React.useState<TContact[]>([]);
  const [contactToDelete, setContactToDelete] = React.useState<TContact | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortOrder, setSortOrder] = React.useState('date-desc');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'contacted' | 'notContacted'>('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const limit = 10; // contacts per page
  const { toast } = useToast();

  // 🔹 Fetch contacts with pagination and filters
  const fetchContacts = async (page = 1) => {
    try {
      const offset = (page - 1) * limit;
      const isContacted =
        statusFilter === 'contacted' ? true : statusFilter === 'notContacted' ? false : undefined;
      const res = await getAllContactsApi(offset, limit, searchTerm, isContacted);
      setContacts(res.data.contacts);
      setTotalPages(Math.ceil(res.data.totalCount / limit));
      setCurrentPage(page);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch contacts.',
      });
    }
  };

  React.useEffect(() => {
    fetchContacts(1); // reset to first page on search or filter change
  }, [searchTerm, statusFilter]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchContacts(page);
  };

  // 🔹 Delete contact
  const handleDelete = async (contactId: string) => {
    try {
      await deleteContactApi(contactId);
      toast({
        title: 'Contact Deleted',
        description: 'The contact has been successfully deleted.',
      });
      fetchContacts(currentPage);
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete contact.',
      });
    } finally {
      setContactToDelete(null);
    }
  };

  // 🔹 Toggle contact status
  const handleToggleStatus = async (contact: TContact) => {
    try {
      await updateContactStatusApi(contact._id, !contact.isContacted);
      toast({
        title: 'Status Updated',
        description: `Marked as ${!contact.isContacted ? 'Contacted' : 'Not Contacted'}.`,
      });
      fetchContacts(currentPage);
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update status.',
      });
    }
  };

  const filteredAndSortedContacts = React.useMemo(() => {
    return contacts.sort((a, b) => {
      if (sortOrder === 'date-asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [contacts, sortOrder]);

  return (
    <>
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Date (Newest)</SelectItem>
                <SelectItem value="date-asc">Date (Oldest)</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as 'all' | 'contacted' | 'notContacted')}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="notContacted">Not Contacted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedContacts.map((contact) => (
            <TableRow key={contact._id}>
              <TableCell className="font-medium">{contact.name}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell className="max-w-xs truncate">{contact.message}</TableCell>
              <TableCell>{new Date(contact.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge
                  variant={contact.isContacted ? 'default' : 'secondary'}
                  className={contact.isContacted ? 'bg-green-600' : ''}
                >
                  {contact.isContacted ? 'Contacted' : 'Not Contacted'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleToggleStatus(contact)}>
                      {contact.isContacted ? (
                        <XCircle className="mr-2 h-4 w-4" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      Mark as {contact.isContacted ? 'Not Contacted' : 'Contacted'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialog
                      open={!!contactToDelete && contactToDelete._id === contact._id}
                      onOpenChange={(isOpen) => !isOpen && setContactToDelete(null)}
                    >
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="text-destructive"
                          onClick={() => setContactToDelete(contact)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this contact.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setContactToDelete(null)}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(contact._id)}
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
          ))}
        </TableBody>
      </Table>

      {filteredAndSortedContacts.length === 0 && (
        <div className="flex min-h-[20vh] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center mt-6">
          <h3 className="text-xl font-bold tracking-tight">No contacts found</h3>
          <p className="mt-2 text-muted-foreground">Try adjusting your search, filters, or page.</p>
        </div>
      )}

      {/* Pagination */}
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
    </>
  );
}