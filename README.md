# ČO stream GFX

Livestream graphics for Český orienťák.

# Usage

```shell
yarn install
yarn run dev
```

Pass `?debug` to enable debug mode.


# Architecture

```mermaid
flowchart TB
    subgraph thejoeejoee/co-stream-gfx
        co-stream-gfx-proxy[GFX proxy<br>webhook <=> SSE]
        co-stream-gfx-app[GFX web app] -.-|GET SSE<br>EVENT&data| co-stream-gfx-proxy
    end

    subgraph vmix/obs
        browser-source[Browser source] -.->|open| co-stream-gfx-app
    end
    
    subgraph orienteering-tv-graphics/control/v2025
        control-web[Control web] -->|POST| control-api[Control API]

        control-api --->|POST<br>/webhook/EVENT| co-stream-gfx-proxy
    end
```

# Flag vs. Club Display

|                             | is_national | is_international (==!is_national) |
|-----------------------------|-------------|-----------------------------------|
| is_relay                    | club        | club+flag                         |
| is_individual (==!is_relay) | club        | flag                              |
