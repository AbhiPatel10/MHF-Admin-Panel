'use client';

import * as React from 'react';
import type { Category } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { CategoryDialog } from '@/components/CategoryDialog';
import { createCategoryApi, getAllCategoriesApi, deleteCategoryApi, updateCategoryApi } from '@/services/categoryService';

export function CategoriesClient() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);
  const [categoryName, setCategoryName] = React.useState('');
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const res = await getAllCategoriesApi(0, 20);
      setCategories(res.data.categories);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch categories.',
      });
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  // 🔹 Delete category
  const handleDelete = async (categoryId: string) => {
    try {
      await deleteCategoryApi(categoryId);
      toast({
        title: 'Category Deleted',
        description: 'The category has been successfully deleted.',
      });
      fetchCategories();
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete category.',
      });
    }
  };

  // 🔹 Add category
  const handleAddCategory = async () => {
    if (!categoryName) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Category name is required.',
      });
      return;
    }
    try {
      await createCategoryApi({ name: categoryName });
      setIsDialogOpen(false);
      setCategoryName('');
      toast({
        title: 'Category Added',
        description: 'The new category has been successfully added.',
      });
      fetchCategories();
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add category.',
      });
    }
  };

  const handleCategory = () => {
    if (selectedCategory) {
      handleEditCategory();
    } else {
      handleAddCategory();
    }
  };

  // 🔹 Edit category
  const handleEditCategory = async () => {
    if (!selectedCategory || !categoryName) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Category name is required.',
      });
      return;
    }
    try {
      await updateCategoryApi(selectedCategory._id, { name: categoryName });
      setIsDialogOpen(false);
      setSelectedCategory(null);
      setCategoryName('');
      toast({
        title: 'Category Updated',
        description: 'The category has been successfully updated.',
      });
      fetchCategories();
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update category.',
      });
    }
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setSelectedCategory(null);
    setCategoryName('');
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="flex justify-end pb-4">
        <Button onClick={() => openAddDialog()}>
          <PlusCircle className="mr-2" />
          Add Category
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category._id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openEditDialog(category)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the category.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(category._id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add/Edit Category Dialog */}
      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        onSave={handleCategory}
        selectedCategory={selectedCategory}
      />
    </>
  );
}
