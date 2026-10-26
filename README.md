# Movie Night

Movie finder for M2 · Async Odyssey.

## Run locally

npm install
npm run dev

Open the local URL printed by Vite. Unlike M1, do not open index.html by double-clicking.

## Production build

npm run build
npm run preview

## Uso de IA

Prompt:
I'm starting module M2 ("Async Odyssey") of my web dev course. The project is a movie finder using the TMDB API. Requirements from the rubric:

must use Vite (not opening index.html directly like M1)
fetch data asynchronously with proper loading, error and empty states
at least one filter and some kind of statistic calculated with array methods (they specifically want reduce)
some kind of persistence with localStorage
responsive, accessible, no frameworks, vanilla JS only

I've never used Vite or a real API with a key before. Don't write the whole thing for me, just
Help me plan stages so I can see the workflow more or less, and tell me what files I should have and what each one is responsible for.


Prompt:
Here's my first version of the server middleware: (This message isnt part of the prompt, but during the real prompt I pasted code here. I just didnt want to clutter the README). It works when everything is fine, but I want it to be solid. Walk me through every way this request can fail and what status code and message the browser should get for each one:

empty query or a crazy long query
token missing because I forgot .env.local
token wrong or expired
TMDB is down or slow
TMDB returns something weird
someone sends a POST
I want the messages to be things a normal user could understand, but still useful to me while debugging. Also, should my server pass TMDB's status code straight through, or translate it?
Make sure you explain yourself clearly step by step.


## Autopsia

## Autopsia

1. I cache search results in localStorage for 24 hours instead of
   requesting them again every time. This reduces repeated requests
   and preserves results after refreshing the page. The disadvantage
   is that ratings or movie information may be outdated until the
   cache expires. I considered keeping results only in memory, but
   that would lose them when the page reloads. If storage fails,
   the app still works by requesting fresh data.

2. I calculate the average rating using only rated movies currently
   displayed after filtering. Unrated movies are excluded instead
   of being treated as zero, because zero would incorrectly lower
   the average. Each rated movie has equal weight. A vote-weighted
   average was another option, but I chose a simple average that
   describes the displayed movies rather than their individual votes.
