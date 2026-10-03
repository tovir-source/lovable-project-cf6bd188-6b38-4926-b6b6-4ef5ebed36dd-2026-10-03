<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the tournament entirely in local JSON with derived standings and bracket logic in frontend modules, because the organizer updates files manually and requires no backend.
- Use TanStack Start routes and Tailwind in this Lovable project rather than Astro, because the preview runtime is fixed to TanStack Start.
- Keep F9 and F8 competition formats separate while sharing presentation components, because their qualification paths differ in the source document.
