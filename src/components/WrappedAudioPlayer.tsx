import { inject, observer } from "mobx-react";
import React from "react";

import { ObservableAudioPlayer } from "src/components/ObservableAudioPlayer";
import { IRootStore } from "src/stores/RootStore";

@inject("store")
@observer
export class WrappedAudioPlayer extends React.Component<{
  store?: IRootStore;
}> {
  public render() {
    const audio = this.props.store!.audioStore.currentAudio;
    return <ObservableAudioPlayer audio={audio} />;
  }
}
