import { MessagePlayer, MessageType } from "~/components/player";

interface FeaturedMessageProps {
  sermon: Partial<Sermon>;
}

export const FeaturedMessage: React.FC<FeaturedMessageProps> = ({ sermon }) => {
  /// Theoretically featured would just take a SID (sermon id) and use the API to get the rest of this info
  return (
    <div className="p-4">
      <h1 className="text-2xl pl-4 py-2 bg-gray-300 rounded-lg w-full text-black">
        Featured Message
      </h1>
      <div className="bg-white">
        <div className="p-2">
          <MessagePlayer
            title={sermon.title ?? ""}
            url={sermon.audioUrl ?? ""}
            iconUrl={sermon.contributor?.imageUrl ?? ""}
            speaker={sermon.contributor?.fullName ?? ""}
            description={sermon.description ?? ""}
            media={MessageType.Audio}
            downloads={sermon.hits ?? 0}
            // TODO: @Caleb Return these from the API in a better format
            // TODO: Topics can be a list probably?
            topic={sermon.topics?.map((topic) => topic.name).join(", ") ?? ""}
            scriptures={sermon.bibleReferences?.map((ref) => ref.text) ?? []}
            // todo: experiment with comments
          />
        </div>
      </div>
    </div>
  );
};
