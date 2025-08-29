import { Tooltip } from "react-tooltip";
import { RiExternalLinkLine } from "react-icons/ri";
import { FaCircleCheck, FaCircleXmark, FaClock } from "react-icons/fa6";

import {
  GoToPr,
  PullRequestContainer,
  PullRequestInfoContainer,
  PullRequestReviewContainer,
} from "./styled";
import { IPr } from "../../model/IPr";
import { getPullRequestUrl } from "../../utils/url";

type PullRequestProps = {
  imageUrl: string;
  title: string;
  createdBy: string;
  data: IPr;
};

enum Status {
  "Approved" = 10,
  "ApprovedWithSuggestions" = 5,
  "NoVote" = 0,
  "WaitingForAuthor" = -5,
  "Rejected" = -10,
}

function PullRequest({ imageUrl, title, createdBy, data }: PullRequestProps) {
  const getStatus = (status: number) => {
    if ([Status.Approved, Status.ApprovedWithSuggestions].includes(status)) {
      return <FaCircleCheck color="#55a362" />;
    }

    if (status === Status.WaitingForAuthor) {
      return <FaClock color="#d67f3c" />;
    }

    if (status === Status.Rejected) {
      return <FaCircleXmark color="#cd4a45" />;
    }

    return <></>;
  };

  return (
    <PullRequestContainer>
      <Tooltip id="tooltip" place="top" />
      <a data-tooltip-id="tooltip" data-tooltip-content={createdBy}>
        <img src={imageUrl} alt="user image" className="user-image" />
      </a>
      <PullRequestInfoContainer>
        <span>{title}</span>
        <span>
          {data.sourceRefName} -&gt; {data.targetRefName}
        </span>
      </PullRequestInfoContainer>
      <PullRequestReviewContainer>
        {data.reviewers
          ?.filter((r) => !r.isContainer)
          .map((reviewer) => (
            <a
              data-tooltip-id="tooltip-review"
              data-tooltip-content={reviewer.displayName}
              key={reviewer.id}
            >
              <Tooltip id="tooltip-review" place="top" />
              <img src={reviewer.imageUrl} />
              {getStatus(reviewer.vote)}
            </a>
          ))}
      </PullRequestReviewContainer>
      <GoToPr target="_blank" href={getPullRequestUrl(data)}>
        <RiExternalLinkLine />
      </GoToPr>
    </PullRequestContainer>
  );
}

export default PullRequest;
