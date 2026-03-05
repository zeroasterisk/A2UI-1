# How Does A2UI Compare?

The agentic UI space is evolving rapidly. Here's how A2UI relates to the other major approaches.

## A2UI vs MCP Apps

[MCP Apps](https://blog.modelcontextprotocol.io/posts/2025-11-21-mcp-apps/) treat UI as a **resource** — servers provide pre-built HTML via `ui://` URIs, rendered in sandboxed iframes. A2UI takes a **native-first** approach — agents send component blueprints that render using the client's own design system. Choose MCP Apps for self-contained widgets; choose A2UI for dynamic, cross-platform, LLM-generated UI.

## A2UI vs AG UI / CopilotKit

[AG UI](https://ag-ui.com/) is a **transport protocol** connecting agent backends to frontends with real-time state sync. A2UI is a **UI format** — the payload that describes what to render. They're complementary: use AG UI as the pipe, A2UI as the content. AG UI has day-zero A2UI compatibility.

## A2UI vs ChatKit (OpenAI)

[ChatKit](https://openai.com) offers a tightly integrated experience within the OpenAI ecosystem. A2UI is **platform-agnostic** — designed for developers building their own agentic surfaces across web, mobile, and desktop, or for multi-agent systems where agents need to render UI across trust boundaries.

## Using Them Together

These approaches are complementary, not competing:

- **A2UI + AG UI** — AG UI as transport, A2UI as the generative UI format
- **A2UI + A2A** — A2UI messages sent via the [A2A protocol](../concepts/transports.md) for multi-agent systems
- **A2UI + MCP** — Upcoming bridge lets MCP servers provide A2UI blueprints alongside HTML resources

## Further Reading

- [What is A2UI?](what-is-a2ui.md) — Protocol overview
- [Transports](../concepts/transports.md) — How A2UI messages travel between agents and clients
- [Where is A2UI Used?](../ecosystem/where-is-it-used.md) — Case studies and adopters
