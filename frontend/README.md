This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

This using Next.js 15 so it's requirement nodeJS 18.8 or newer
## Getting Started
First, install all the package that I used: 
```bash
npm install 
# or (I suggest using yarn for more convenient :D) 
yarn install 
```
Run the development server:

```bash
npm run dev
# or
yarn dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


and the shop is at [http://localhost:3000/shop](http://localhost:3000/shop)
# For Innotech Interview 
So basically this page is using Shadcn UI for styling & components so I could help me create without spending so much time on styling

For the shop page, I'm using grid & flex box for the layout and skeleton loading.

This project is using client-side rendering instead of SSR because:
- Customers gonna using filter and search for many time so using CSR is reducing the loading of everything due to the life-cycle of React (only render what change) (non-functional)
- The requirement not require index category for SEO & Sitemap so I'm using category selecting at /shop?category=xxxx instead of /category/xxxxx/ (non-functional)
- Reusing skeleton loading help customer have greater experience (non-functional)

The API do support paginate but it don't have filter, search by keywords, category so applying pagination is make no sense here so I skipped

Filter & Sort: 
- I do add hooks on enter pressing on input so it can apply filter
- I had implement `window.history.pushState` on using filter so if you refresh the page it still there (don't have to select filter or sort condition again).



On thing I would chance or improve is 
- Instead of listing all products it should have recommendation instead listing by `createdAt` or `id` because if this site have a lot of SKUs and they update frequently every single time using select filter or do something it's might showing random product or same product and it kinda annoying.
- `Product in same category` or `Our recommend` on product detail page because it kinda empty

(public) folder is grouping all the slug that open for visitor so it's not require customer to having the account.

Added nginx & dockerfile

