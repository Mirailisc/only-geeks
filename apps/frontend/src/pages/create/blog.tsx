// import React from 'react'

import { Editor } from "@/components/blocks/editor-x/editor"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import AuthNavbar from "@/components/utils/AuthNavbar"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { FileTextIcon, SaveIcon } from "lucide-react"

const CreateBlog = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  return (
    <>
      <AuthNavbar />
      <div className="container mx-auto">
        <div className="flex flex-row gap-2 items-center mt-6">
          <FileTextIcon className="h-6 w-6 text-primary" />
          <Input variant={"ghost-growth"} inputSize={"sm"} maxWidth={isDesktop ? 900 : 400} className="w-52" placeholder="Enter your blog title" />
          <SaveIcon className="h-6 w-6 text-muted-foreground/20" />
        </div>
        <Separator className="my-4" />
        <div>
          <Editor />
        </div>
      </div>
    </>
  )
}

export default CreateBlog