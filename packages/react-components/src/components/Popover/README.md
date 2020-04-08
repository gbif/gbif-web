# Modal

There are so many modal libraries. We should just use one of those, for now we use this custom one and if it becomes cumbersome, we can use/wrap one of the many library versions. I just tried Reakit, but it triggered an aweful lot of rerenders, do not support RTL and had a somewhat akward API as it needed to control the trigger as well.

`aria-haspopup` is not recommended to use for anything but menus (in their formal definition)
https://www.w3.org/WAI/PF/aria/states_and_properties#aria-haspopup
http://whatsock.com/tsg/
There are suggestions to change it though as some readers interpret it differently
https://lists.w3.org/Archives/Public/public-pfwg-comments/2013OctDec/0004.html
interpretation also varies per reader per tag type, other attributes and per version. There do not seem to be a clear answer. In general the recommendation is to do less, rather than too much that is wrong.

In this case we will follow w3 and leave it out.

The advantage of this, is that the trigger can be anything clickable. The trigger do not have any special attributes, making it simple to seperate it from the modal component and make it controlled.