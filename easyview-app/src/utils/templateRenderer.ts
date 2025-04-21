import path from "path";
import { readFile } from "fs/promises";
import Handlebars from "handlebars";

export const renderTemplate = async (templateName: string, data: object) => {
  try {
    const templatePath = path.resolve(__dirname, "../views", `${templateName}.hbs`);
    const basePath = path.resolve(__dirname, "../views", "base.hbs");

    const [templateSource, baseSource] = await Promise.all([
      readFile(templatePath, "utf-8"),
      readFile(basePath, "utf-8")
    ]);

    const template = Handlebars.compile(templateSource);
    const baseTemplate = Handlebars.compile(baseSource);

    // Compile content first, to populate blocks
    template(data);

    // Then render the base template with the same data
    return baseTemplate(data);
  } catch (error) {
    console.error("Error rendering template:", error);
    throw new Error("Template rendering failed");
  }
};