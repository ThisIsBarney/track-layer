import { PathLayer } from 'deck.gl';
import vs from './track-layer.vert';
import vs64 from './track-layer-64.vert';
import fs from './track-layer.frag';

export default class TrackLayer extends PathLayer {
  draw({ uniforms }) {
    super.draw({
      uniforms:
        {
          ...uniforms,
          trailLength: this.props.trailLength,
          currentTime: this.props.currentTime,
          maxSpeed: this.props.maxSpeed,
          roundCapScale: this.props.roundCapScale,
        },
    });
  }

  getShaders() {
    return this.is64bitEnabled()
      ? {
        ...(super.getShaders()),
        vs: vs64,
        fs,
      }
      : {
        ...(super.getShaders()),
        vs,
        fs,
      };
  }
}
TrackLayer.layerName = 'TrackLayer';
TrackLayer.defaultProps = {
  ...PathLayer.defaultProps,
  currentTime: 0,
  maxSpeed: 999999,
  roundCapScale: 0.1,
  trailLength: 100,
};
