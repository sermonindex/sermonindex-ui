import React, { useState } from 'react';
import { CommentaryVerse, ListResponse } from '~/api/interfaces';
import { linkifyScripture } from '~/components/linkify-scripture';
import {
  TabContainer,
  TabContent,
  TabList,
  TabListItem,
} from '~/components/tabs';

export interface CommentaryVerseProps {
  commentaries: ListResponse<CommentaryVerse>;
}

export const CommentaryByVerseTabbed = ({
  commentaries,
}: CommentaryVerseProps) => {
  if (commentaries.values.length === 0) {
    return null;
  }

  const [activeCommentaryTab, setActiveCommentaryTab] = useState(
    commentaries.values[0].id,
  );

  return (
    <TabContainer>
      <TabList tabStyle="pill">
        {commentaries.values.map((commentary, index) => (
          <TabListItem
            title={commentary.author ?? commentary.name}
            tabStyle="pill"
            key={index}
            active={commentary.id === activeCommentaryTab}
            onClick={() => setActiveCommentaryTab(commentary.id)}
          />
        ))}
      </TabList>

      {commentaries.values.map((commentary, index) => (
        <TabContent key={index} active={commentary.id === activeCommentaryTab}>
          <h1 className="px-2 pt-2 font-semibold">{commentary.name}</h1>
          <p className="px-2 pt-2 whitespace-pre-line">
            {linkifyScripture(commentary.text).map((part, index) => (
              <React.Fragment key={index}>{part}</React.Fragment>
            ))}
          </p>
        </TabContent>
      ))}
    </TabContainer>
  );
};
