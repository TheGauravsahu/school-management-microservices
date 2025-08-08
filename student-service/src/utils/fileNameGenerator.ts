interface FileNameOptions {
  classNumber?: number;
  section?: string;
  gender?: string;
  base?: string;
  extension?: string;
}

export function generateExportFileName(options: FileNameOptions): string {
  const {
    classNumber,
    section,
    gender,
    base = "students",
    extension = "pdf",
  } = options;

  const parts = [
    base,
    classNumber ? `class-${classNumber}` : "",
    section ? `section-${section}` : "",
    gender ? `gender-${gender}` : "",
    "list",
    new Date().toISOString().replace(/[:.]/g, "-"),
  ].filter(Boolean);

  return `${parts.join("_")}.${extension}`;
}
