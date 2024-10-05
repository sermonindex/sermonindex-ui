import {MessagePlayer, MessageType} from "~/components/player";

export const FeaturedMessage = () => {
  /// Theoretically featured would just take a SID (sermon id) and use the API to get the rest of this info
  return (
    <div className="p-4">
      <div className="bg-white border-slate-100 rounded-lg">
        <div className="p-2">
          <MessagePlayer
            title="True Discipleship"
            url="https://ia902204.us.archive.org/6/items/SERMONINDEX_SID15051/SID15051.mp3"
            iconUrl="app/assets/profiles/zacpoonen.png"
            speaker="Zac Poonen"
            description="Zac Poonen shares his heart plainly at a christian conference. He speaks on true discipleship
              and those that follow Christ and don't gather men and honor to themselves. This message is throbbing with
              love and unselfish desire yet has a strong rebuke and correction for many in ministry. May God allow this
              message to be a balm to many before that great day before God in heaven where all things will be made
              bare."
            media={MessageType.Audio}
            downloads={3832}
            topic={"Discipleship"}
            scriptures={["Matthew 28:19-20"]}
            // todo: experiment with comments
          />
        </div>
      </div>
    </div>
  );
}
