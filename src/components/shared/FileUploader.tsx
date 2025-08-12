import { useCallback, useEffect, useState } from "react";
import { useDropzone, type FileWithPath } from "react-dropzone";
import { LuImageUp } from "react-icons/lu";
import { Button } from "../ui/button";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl?: string; // optional preloaded URL
  clearFiles: boolean;
};

function FileUploader({
  fieldChange,
  mediaUrl,
  clearFiles,
}: FileUploaderProps) {
  const [_, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl!);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      // Do something with the files
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [fieldChange]
  );

  //reset file input when we trigger cancel on the PostForm.tsx
  useEffect(() => {
    if (clearFiles) {
      setFile([]);
      setFileUrl("");
    }
  }, [clearFiles]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", ".svg"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-col cursor-pointer flex-center bg-card rounded-xl"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {/* {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )} */}

      {fileUrl ? (
        <>
          <div className="flex justify-center flex-1 w-full p-5 lg:p-8">
            <img src={fileUrl} alt="image" className="file_uploader-img" />
          </div>
          <p className="file_uploader-label">Click or drag photo to replace</p>
        </>
      ) : (
        <div className="file_uploader-box">
          <LuImageUp size={64} className="text-card-foreground" />
          <h3 className="mt-6 mb-2 base-medium">Drag Photo here</h3>
          <p className="mb-6 small-regular text-muted-foreground">
            JPG, PNG, SVG
          </p>
          <Button variant="secondary">Select from computer</Button>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
