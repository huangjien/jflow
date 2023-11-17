import { Avatar, Accordion, AccordionItem, Spacer } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../lib/useSettings';
import { extractContentAccordingContentList } from '../lib/useGithubContent';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

export const Comment = ({ issue_id }) => {
  /**
   * Fetches and displays comments related to a specific issue.
   *
   * @param {number} issue_id - The ID of the issue for which comments should be fetched.
   * @returns {JSX.Element} - The rendered component.
   */
  const { t } = useTranslation();
  const { getSetting } = useSettings();
  const commentContent = getSetting('comment.content');
  const commentContentList = commentContent.split(',');
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    const temp_array = [];
    // console.log(issue_id);
    fetch('/api/comments?issue_number=' + issue_id, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((comment) => {
        // foreach to handle a comments array here
        // console.log(comment);
        comment.forEach((oneComment) => {
          const oneCommentContent = extractContentAccordingContentList(
            commentContentList,
            oneComment
          );
          temp_array.push(oneCommentContent);
        });
        setCommentList(temp_array);
      });
  }, [commentContentList, issue_id]);

  return (
    <>
      {commentList && (
        <Accordion shadow bordered>
          {commentList.map((oneComment) => (
            <AccordionItem
              aria-label={oneComment.id}
              key={oneComment.id}
              title={
                <div className="inline-flex m-4">
                  <Avatar
                    zoomed
                    bordered
                    text={oneComment['user.login']}
                    src={oneComment['user.avatar_url']}
                  />

                  <i>{oneComment['user.login']}</i>
                </div>
              }
              subtitle={
                (oneComment.created_at === oneComment.updated_at
                  ? ''
                  : t('issue.last_update') +
                    ': ' +
                    oneComment.updated_at.toString()) +
                ' ' +
                t('issue.created') +
                ': ' +
                oneComment.created_at.toString()
              }
            >
              <div className="prose prose-stone dark:prose-invert lg:prose-xl max-w-fit">
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {oneComment.body}
                </Markdown>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </>
  );
};
