'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Category } from '@/lib/types';

interface AddCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categoryName: string;
    setCategoryName: (name: string) => void;
    onSave: () => void;
    selectedCategory: Category | null;
}

export function CategoryDialog({
    open,
    onOpenChange,
    categoryName,
    setCategoryName,
    onSave,
    selectedCategory
}: AddCategoryDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{selectedCategory ? "Add New" : "Edit"} Category</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the {selectedCategory ? "new" : "edit"} category.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className="col-span-3"
                            placeholder="Category Name"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={onSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
