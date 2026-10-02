
import { Page } from "@playwright/test";
import { BasePage } from "./Base.Page";

export class WikiHomePage extends BasePage {
    readonly searchInput: string;
    readonly searchButton: string;
    readonly title: string;

    constructor(page: Page) {
        super(page);
        this.searchInput = 'Buscar en Wikipedia';
        this.searchButton = 'Buscar';
        this.title = 'Wikipedia, la enciclopedia libre';
    }

    async goToWikiPage(url: string, title: string): Promise<void> {
        await this.navigateTo(url, title);
    }
    async fillSearchInput(text: string): Promise<void> {
        await this.fillInput(this.page.getByLabel(this.searchInput), text);
    }
    async clickSearchButton(): Promise<void> {
        await this.clickElement(this.page.getByRole('button', { name: this.searchButton }));
    }
    async getTitlePage(): Promise<string> {
        return await this.page.title();
    }
}