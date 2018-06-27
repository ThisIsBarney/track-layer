# @thisisbarney/track-layer

a track layer, displaying tracks of vehicles, derived from PathLayer.

```jsx harmony
import React from 'react';
import TrackLayer from '@thisisbarney/track-layer';

const layers = [
  new TrackLayer({
    // parameters same with PathLayer
    id: 'points',
    data,
    // different
    trailLength: 300,
    getWidth: d => 10,
    getPath: d => d.path,
    currentTime: time,
    maxSpeed: 5,
  })
];
```

Key parameters different from `PathLayer` is `getPath` and `curentTime`,
`getPath` maps a data row to a path consists of `[x, y, time]`,
`currentTime` corresponds with `time` in `path`.

`trailLength` defines the length of each track,
`maxSpeed` is used to filter out invalid(too fast) points,
`getWidth` allows to pass a mapping to control each track's width.