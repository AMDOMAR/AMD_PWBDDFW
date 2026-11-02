declare module 'multiple-cucumber-html-reporter' {
  interface ReporterOptions {
    jsonDir: string;
    reportPath: string;
    pageTitle?: string;
    reportName?: string;
    openReportInBrowser?: boolean;
  }

  const reporter: {
    generate(options: ReporterOptions): void;
  };

  export = reporter;
}
