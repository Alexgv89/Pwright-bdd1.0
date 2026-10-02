export default {
  name: "Playwright BDD - Wikipedia Automation Report",
  historyPath: "./allure-history/history.jsonl",
  appendHistory: true,
  historyLimit: 20,
  environments: {
//... (resto del archivo se mantiene igual)

    dev: {
      name: "Development",
      matcher: (test) => {
        const search = (obj) => {
          if (!obj) return false;
          const s = JSON.stringify(obj).toLowerCase();
          return s && s.includes("dev");
        };
        return search(test.labels) || search(test.parameters);
      },
    },
    qa: {
      name: "QA Environment",
      matcher: (test) => {
        const search = (obj) => {
          if (!obj) return false;
          const s = JSON.stringify(obj).toLowerCase();
          return s && s.includes("qa");
        };
        return search(test.labels) || search(test.parameters);
      },
    },
    release: {
      name: "Release",
      matcher: (test) => {
        const search = (obj) => {
          if (!obj) return false;
          const s = JSON.stringify(obj).toLowerCase();
          return s && (s.includes("release") || s.includes("rel"));
        };
        return search(test.labels) || search(test.parameters);
      },
    },
    prod: {
      name: "Production",
      matcher: (test) => {
        const search = (obj) => {
          if (!obj) return false;
          const s = JSON.stringify(obj).toLowerCase();
          return s && (s.includes("prod") || s.includes("production"));
        };
        return search(test.labels) || search(test.parameters);
      },
    },
  },
  plugins: {
    awesome: {
      options: {
        reportLanguage: "es",
      },
    },
  },
  qualityGate: {
    rules: [
      {
        maxFailures: 0,
        successRate: 1.0,
        minTestsCount: 1,
      },
    ],
  },
};
