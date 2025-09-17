'use client';

import * as React from 'react';
import type { Contact } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Wand2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { suggestVolunteerOpportunities } from '@/ai/flows/suggest-volunteer-opportunities';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export function ContactsClient({ contacts }: { contacts: Contact[] }) {
  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(null);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleOpenDialog = (contact: Contact) => {
    setSelectedContact(contact);
    setSuggestions([]);
  };

  const handleCloseDialog = () => {
    setSelectedContact(null);
  };

  const handleSuggest = async () => {
    if (!selectedContact) return;
    setIsLoading(true);
    try {
      const result = await suggestVolunteerOpportunities({
        contactMessage: selectedContact.message,
      });
      setSuggestions(result.suggestedOpportunities);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description:
          'Failed to get suggestions. Please check the console for more details.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="font-medium">{contact.name}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell className="max-w-xs truncate">{contact.message}</TableCell>
              <TableCell>{contact.date}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" onClick={() => handleOpenDialog(contact)}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Suggest
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!selectedContact} onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Suggest Opportunities for {selectedContact?.name}</DialogTitle>
            <DialogDescription>
              Use AI to suggest volunteer opportunities based on their message.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Contact's Message</h4>
              <ScrollArea className="h-32 rounded-md border p-4">
                <p className="text-sm text-muted-foreground">
                  {selectedContact?.message}
                </p>
              </ScrollArea>
            </div>
            
            <Button onClick={handleSuggest} disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              {isLoading ? 'Generating...' : 'Generate Suggestions'}
            </Button>

            {suggestions.length > 0 && (
              <div className="space-y-2">
                <Separator />
                <h4 className="font-semibold">Suggested Opportunities</h4>
                <div className="rounded-md border bg-muted p-4">
                  <ul className="list-disc space-y-2 pl-5 text-sm">
                    {suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
