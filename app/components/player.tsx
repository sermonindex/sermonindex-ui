import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

import {MediaPlayer, MediaProvider, MediaType} from '@vidstack/react';
import {DefaultAudioLayout, DefaultVideoLayout, defaultLayoutIcons} from '@vidstack/react/player/layouts/default';

import React from 'react';

export enum MessageType {
  Audio = 'audio',
  Video = 'video',
}

interface MessageComment {
  author: string;
  title: string;
  comment: string;
  likes: number;
}

interface MessagePlayerProps {
  title: string,
  speaker: string,
  media: MessageType,
  url: string,
  description: string,
  topic?: string,
  scriptures?: string[],
  iconUrl?: string,
  downloads?: number,
  comments?: MessageComment[],
  message?: MessagePlayerProps
}

export const MessagePlayer = (message: MessagePlayerProps) => {
  switch (message.media) {
    case MessageType.Audio:
      return <AudioPlayer message={message}/>;
    case MessageType.Video:
      return <VideoPlayer message={message}/>;
    default:
      console.log(
        "todo: implement unknown media player (VidStack has an 'unknown' src type, but I haven't checked how it behaves"
      );
  }
}

export const VideoPlayer = (props: React.PropsWithChildren<{ message: MessagePlayerProps }>) => {
  const {message} = props;
  return (
    <div className={"bg-si-main"}>
      <a className={"text-blue-200"}>
        Not Yet Implemented
      </a>
    </div>
  )
}

export const AudioPlayer = (props: React.PropsWithChildren<{ message: MessagePlayerProps }>) => {
  const {message} = props;
  return (
    <div>
      <div className={"p-2 flex items-center space-x-4"}>
        <img src={message.iconUrl} alt={message.speaker} className="flex-none rounded-lg bg-slate-100"
             loading={"lazy"}/>
        <div className="flex-auto space-y-2">
          <h2 className={"text-slate-900 text-lg leading-6 font-semibold truncate"}>{message.title}</h2>
          <div className={"flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 leading-6 text-sm"}>
            <p className={"text-si-main"}>
              <abbr title={"Speaker"}>by</abbr> {message.speaker}
            </p>
            <p className={"text-si-main"}>
              Topic: {message.topic}
            </p>
            <p className={"text-si-main"}>
              Scripture(s): {message.scriptures?.join(", ")}
            </p>
          </div>
          <p className={"text-slate-700 text-sm italic"}>{message.description}</p>
          <div className="flex justify-end">
            <p className={"text-si-main text-sm justify-right"}>
              {message.downloads} downloads
            </p>
          </div>
        </div>
      </div>
      <MediaPlayer title={message.title} src={message.url}>
        <MediaProvider/>
        <DefaultAudioLayout icons={defaultLayoutIcons} colorScheme="light"/>
      </MediaPlayer>
    </div>
  )
}
