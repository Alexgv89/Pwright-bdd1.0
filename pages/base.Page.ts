import { Locator, Page, expect } from "@playwright/test";

export abstract class BasePage{
    readonly page:Page;

    constructor(page:Page){
        this.page = page;
    }

    /**
     * Metodo para navegar a una URL
     * @param url URL a navegar
     * @param title Título esperado de la página
     */
    async navigateTo(url:string,title:string  ):Promise<void>{
        await this.page.goto(url);
         expect( await this.page.title()).toContain(title);
    }
    async fillInput(locator: Locator, text: string):Promise<void>{
        await locator.waitFor({state:'visible'});
        await locator.fill(text);

    }
    async clickElement(locator: Locator):Promise<void>{
        await locator.waitFor({state:'visible'});
        await locator.click();

    }
    async getText(locator: Locator):Promise<string>{
        await locator.waitFor({state:'visible'});
        return await locator.innerText();
    }

    async getTitlePage():Promise<string>{
        await this.page.waitForLoadState('domcontentloaded');
        return await this.page.title();
    }
}