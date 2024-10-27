## Getting Started

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

* get random empoty word
* return history DESC

To do:

* remove empty explain from history SQL query
* support both word and abbreviation in the DB
* add search, add and config button to navbar
* insert word from chat page