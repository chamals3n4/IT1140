import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

export default function DeleteMed({ handleDelete }) {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this</DialogTitle>
            <DialogDescription>
              Anyone who has this link will be able to view this.
            </DialogDescription>
          </DialogHeader>
          {/* <div className="flex items-center space-x-2">
                      <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                          Link
                        </Label>
                        <Input
                          id="link"
                          defaultValue="https://ui.shadcn.com/docs/installation"
                          readOnly
                        />
                      </div>
                      <Button type="submit" size="sm" className="px-3">
                        <span className="sr-only">Copy</span>
                        <Copy />
                      </Button>
                    </div> */}
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
              >
                Hmmm, Yes
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
