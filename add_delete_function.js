const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'resources/js/pages/proposals/manage/show.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add handleDelete function before handleEdit
const handleDelete = `
    const handleDelete = () => {
        setIsSubmitting(true);
        router.delete(route('proposals.manage.destroy', proposal.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Proposal deleted successfully');
                router.visit(route('proposals.manage.index'));
            },
            onError: () => {
                setIsSubmitting(false);
                toast.error('Failed to delete proposal');
            }
        });
    };
`;

content = content.replace(
    'const handleEdit = () => {',
    `${handleDelete}\n    const handleEdit = () => {`
);

// Add delete dialog for rejected proposals
const originalSection = `                                        {proposal.status !== 'pending' && (
                                            <Link href={route('proposals.manage.edit', proposal.id)}>
                                                <Button 
                                                    className="flex items-center gap-2"
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                    Edit Proposal
                                                </Button>
                                            </Link>
                                        )}`;

const newSection = `                                        {proposal.status === 'rejected' && (
                                            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <Button variant="destructive" className="flex items-center gap-2">
                                                        Delete Proposal
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Delete Proposal</DialogTitle>
                                                        <DialogDescription>
                                                            This will permanently delete this rejected proposal. This action cannot be undone.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                                            Cancel
                                                        </Button>
                                                        <Button 
                                                            variant="destructive"
                                                            onClick={handleDelete}
                                                            disabled={isSubmitting}
                                                        >
                                                            {isSubmitting ? 'Deleting...' : 'Delete Permanently'}
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                        
                                        {proposal.status === 'approved' && (
                                            <Link href={route('proposals.manage.edit', proposal.id)}>
                                                <Button 
                                                    className="flex items-center gap-2"
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                    Edit Proposal
                                                </Button>
                                            </Link>
                                        )}`;

content = content.replace(originalSection, newSection);

fs.writeFileSync(filePath, content, 'utf8');
console.log('File updated successfully!'); 