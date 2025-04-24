import { useState } from "react";

type FetchPdf = () => Promise<Response>;

type UsePdfDownload = () => [
  (fetchPdf: FetchPdf, openInNewTab?: boolean) => void,
  boolean,
];

const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;

const usePdfDownload: UsePdfDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPdf = async (fetchPdf: FetchPdf, openInNewTab = false) => {
    try {
      setIsDownloading(true);
      const response = await fetchPdf();
      const blob = await response.blob();
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" }),
      );
      if (openInNewTab) {
        window.open(url, "_blank");
      } else {
        const link = document.createElement("a");

        const contentDispositionHeader = response.headers.get(
          "Content-Disposition",
        );

        const fileNameMatches = fileNameRegex.exec(
          contentDispositionHeader || "",
        );
        const fileName = fileNameMatches
          ? fileNameMatches[1].replace(/['"]/g, "")
          : "document.pdf";

        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      }
      setIsDownloading(false);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error while downloading PDF:", error);
      setIsDownloading(false);
    }
  };

  return [downloadPdf, isDownloading];
};

export { usePdfDownload };
