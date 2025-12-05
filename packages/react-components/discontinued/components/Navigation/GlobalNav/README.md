# Responsive navigation without JS

A responsive menu that works without Javascript (using hovers and checkboxes). 
This is not exactly the standard way and for good reasons as it is akward and provides a strange semantic. 
The various ARIA attributes can help with the sematics though. But why use the akward sibling selectors and hidden checkboxes?

The reason for doing so is to have an interactive menu that works before the JS bundle have loaded. 
And the reason for not having an inline script instead to handle state is that we want to use React after hydration so that we have access to our general state, routing, user etc.

It still needs styling, but the core idea has been tried and tested in an SSR build.
