import { useRequest, useLocalStorageState } from 'ahooks';
import { useEffect, useState } from 'react';
import { getIssues, getReadme, getValueByPath } from './Requests';
import { useSettings } from './useSettings';

export const useGithubContent = () => {
  const { getSetting } = useSettings();
  const [about, setAbout] = useLocalStorageState('about');
  const [rawData, setRawData] = useState();
  const [issues, setIssues] = useLocalStorageState('issues');
  const [tags, setTags] = useState();

  useRequest(getReadme, {
    onSuccess: (result) => {
      setAbout(result);
    },
  });

  useRequest(getIssues, {
    onSuccess: (result) => {
      setRawData(JSON.parse(result));
    },
    staleTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (rawData) {
      // console.log(rawData)
      const blog_labels = getSetting('blog.labels');
      const issueContent = getSetting('blog.content');
      const issueContentList = issueContent.split(',');

      if (blog_labels && issueContent) {
        const list = blog_labels.split(',');
        setTags(list);

        let finalResult = [];
        rawData.forEach((issue) => {
          const labels = issue['labels'];
          let isVisible = false;
          let labelArray = [];
          labels.forEach((label) => {
            // console.log(label['name'])
            if (list.includes(label['name'])) {
              isVisible = true;
              labelArray.push(label.name);
            }
          });
          if (isVisible) {
            // then we start handle this issue: we only care the the content in the issueContent
            let content = extractContentAccordingContentList(
              issueContentList,
              issue
            );
            content['labels.name'] = labelArray;
            // console.log(content)
            finalResult.push(content);
          }
        });
        setIssues(finalResult);
      }
    }
  }, [getSetting, setIssues, rawData]);

  return { tags, issues, about };
};

// extract a new subset from the content, according content list, then add a html field according body
export function extractContentAccordingContentList(
  contentList,
  originalContent
) {
  let content = {};
  contentList.forEach((key) => {
    content[key] = getValueByPath(originalContent, key);
  });
  return content;
}
