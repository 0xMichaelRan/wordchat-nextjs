Run the development server:

```bash
pnpm i

pnpm install -D @shadcn/ui
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add scroll-area
pnpm dlx shadcn@latest add textarea
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add label
pnpm dlx shadcn@latest add select
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add dropdown-menu
pnpm dlx shadcn@latest add table
pnpm dlx shadcn@latest add slider
pnpm dlx shadcn@latest add badge

npm run dev
```

To bind IP, run this in PowerShell (admin):

```powershell
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=172.22.170.120
netsh interface portproxy add v4tov4 listenport=8080 listenaddress=0.0.0.0 connectport=8080 connectaddress=172.22.170.120
```

Then the app will be accessible at http://<host-machine-ip>:3000

## Backlog

Done:

* [1] Get random empty word
* [1] Return history in DESC order
* [1] Remove empty explain from history SQL query
* [1] Add search, add and config button to navbar

To do:

* [2] Do not query Pinecone directly, but use DB as cache
* [1] change 'pinecone_status' to 'edit_since_embedding'
* [3] Support both word and abbreviation in the DB
* [1] insert word from chat page