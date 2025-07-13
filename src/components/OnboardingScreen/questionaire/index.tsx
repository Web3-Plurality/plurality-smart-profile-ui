import { useState, useRef, useEffect } from "react"
import { Input, Select, Tag } from "antd"
import styled from "styled-components"
import CustomButton from "../../customButton"
import { useStepper } from "../../../hooks/useStepper"
import { API_BASE_URL, CLIENT_ID } from "../../../utils/EnvConfig"
import { getLocalStorageValueofClient } from "../../../utils/Helpers"
import { Tags } from "../../../types"
import { updatePublicSmartProfileAction } from "../../../utils/SmartProfile"
import axios from "axios"

// Updated interfaces to match the new data structure
interface TagGroup {
  category: string
  tags: string[]
}

interface Question {
  type: "SIMPLE_QUESTION" | "MULTICHOICE_QUESTION" | "CATEGORY_QUESTION"
  question: string
  supportingText?: string
  options?: string[]
  tagGroups?: TagGroup[]
}

interface AnswerObject {
  question: string;
  questionType: string;
  answer: string | string[] | Record<string, string[]>;
}

interface Answers {
  [key: number]: AnswerObject;
}

const Container = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  max-height: 600px;
`

const Card = styled.div`
  width: 430px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  border-radius: 24px;
  min-height: 500px;
  @media (max-width: 440px) {
            width: auto; 
        }
`

const Header = styled.div<{ questionType: string }>`
  flex-shrink: 0;
  padding: 0;
`

const ProgressBarContainer = styled.div`
  padding: 0;
  margin: 0;
  width: 100%;
`

const ProgressBar = styled.div`
  height: 4px;
  background-color: #e8e8e8;
  border-radius: 4px;
  width: 100%;
`

const Progress = styled.div<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background-color: #333;
  border-radius: 4px;
  transition: width 0.3s ease;
`

const Title = styled.h1`
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
  margin-left: 30px;
`

const Content = styled.div<{ questionType: string }>`
  padding: 18px;
  gap: 8px;
  margin-top: ${({ questionType }) => (questionType === "CATEGORY_QUESTION" ? "-20px" : "70px")};
`

const Question = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #222;
  margin-bottom: 8px;
`

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
`

const StyledInput = styled(Input)`
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  font-size: 16px;
  margin: 20px 0;
  
  &:focus, &:hover {
    border-color: #d0d0d0;
    box-shadow: none;
  }
  
  &::placeholder {
    color: #999;
  }
`

const StyledSelect = styled(Select)<{isIframe: boolean}>`
  width: 400px;
  margin: 20px 0;
  .ant-select-selector {
    padding: 20px 16px !important;
    height: auto !important;
    border-radius: 12px !important;
    border: 1px solid #e0e0e0 !important;
  }
  
  .ant-select-selection-item {
    font-size: 16px;
    display: flex;
    align-items: center;
  }

  @media (max-width: 440px) {
    max-width: ${({ isIframe }) => (isIframe ? "338px" : "352px")};
   ; 
  }

  @media (max-width: 380px) {
    max-width: ${({ isIframe }) => (isIframe ? "288px" : "300px")};
  }
`

const BackButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  display: block;
  margin: 20px auto 16px;
  
  &:hover {
    color: #444;
  }
`

const TagsContainer = styled.div`
  margin-top: 16px;
  max-height: 250px;
  overflow-y: auto;
`

const ScrollableTagsSection = styled.div`
  padding-right: 8px;
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`

const CategoryTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  margin-top: 16px;
`

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`

const StyledTag = styled(Tag) <{ selected: boolean }>`
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  margin-right: 0;
  background-color: ${({ selected }) => (selected ? "#333" : "#f0f0f0")};
  color: ${({ selected }) => (selected ? "white" : "#333")};
  border: none;
  
  &:hover {
    opacity: 0.9;
  }
`

const ButtonContainer = styled.div<{ type: string }>`
  margin-top:${({ type }) => (type === "SIMPLE_QUESTION" ? "20px" : type === "MULTICHOICE_QUESTION" ? "11px" : "auto")};
  display: flex;
  flex-direction: column;
  align-items: center;
`

const OnboardingForm = ({ currentStep1, setCurrentStep1 }: { currentStep1: number, setCurrentStep1: (step: number) => void }) => {
  const queryParams = new URLSearchParams(location.search)
  const clientId = queryParams.get("client_id") || CLIENT_ID

  const { onboardingQuestions: ONBOARDING_QUESTIONS, profileTypeStreamId, showRoulette } = getLocalStorageValueofClient(`clientID-${clientId}`)
  const { smartProfileData: parsedUserOrbisData } = getLocalStorageValueofClient(`streamID-${profileTypeStreamId}`)

  // const [currentStep, setCurrentStep] = useState(0)
  const { goToStep } = useStepper()
  const [answers, setAnswers] = useState<Answers>({})
  const [loading, setLoading] = useState(false)
  const tagsContainerRef = useRef<HTMLDivElement>(null)

  const totalSteps = ONBOARDING_QUESTIONS.length
  const currentQuestion = ONBOARDING_QUESTIONS[currentStep1]
  const progress = ((currentStep1 + 1) / totalSteps) * 100

  // Reset scroll position when navigating between questions
  const resetScroll = () => {
    if (tagsContainerRef.current) {
      tagsContainerRef.current.scrollTop = 0
    }
  }

  // Use this in handleNext and handleBack
  const handleNext = () => {
    if (currentStep1 < totalSteps - 1) {
      setCurrentStep1(currentStep1 + 1)
      // Reset scroll position after state update
      setTimeout(resetScroll, 0)
    } else {
      submitData()
    }
  }

  const handleBack = () => {
    if (currentStep1 > 0) {
      setCurrentStep1(currentStep1 - 1)
      // Reset scroll position after state update
      setTimeout(resetScroll, 0)
    } else {
      goToStep('profileSetup')
    }
  }

  // Also reset scroll when component mounts or currentStep1 changes
  useEffect(() => {
    // Use setTimeout to ensure this runs after render
    setTimeout(resetScroll, 0)
  }, [currentStep1])

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswers({
      ...answers,
      [currentStep1]: {
        question: currentQuestion.question,
        questionType: currentQuestion.type,
        answer: e.target.value,
      },
    });
  };

  const handleMultiChoiceChange = (value: unknown) => {
    setAnswers({
      ...answers,
      [currentStep1]: {
        question: currentQuestion.question,
        questionType: currentQuestion.type,
        answer: value as string,
      },
    });
  };

  const handleTagToggle = (category: string, tag: string) => {
    const currentAnswers = (answers[currentStep1]?.answer as Record<string, string[]>) || {};
    const currentTags = [...(currentAnswers[category] || [])];
    const tagIndex = currentTags.indexOf(tag);

    if (tagIndex === -1) {
      currentTags.push(tag);
    } else {
      currentTags.splice(tagIndex, 1);
    }

    // Clone the currentAnswers to modify it safely
    const updatedAnswers = { ...currentAnswers };

    if (currentTags.length === 0) {
      // Remove the entire category if no tags remain
      delete updatedAnswers[category];
    } else {
      // Otherwise, update the category with the new tags
      updatedAnswers[category] = currentTags;
    }

    setAnswers({
      ...answers,
      [currentStep1]: {
        question: currentQuestion.question,
        questionType: currentQuestion.type,
        answer: updatedAnswers,
      },
    });
  };


  const isTagSelected = (category: string, tag: string): boolean => {
    const categoryAnswers = (answers[currentStep1]?.answer as Record<string, string[]>) || {};
    return categoryAnswers[category]?.includes(tag) || false;
  };

  const postResponse = () => {
    setLoading(false)
    if (showRoulette) {
      goToStep("socialConnect")
    } else {
      goToStep("consent")
    }
  }

  const submitData = async () => {
    try {
      setLoading(true)
      const { token } = getLocalStorageValueofClient(`clientID-${clientId}`)
      const response = await axios.put(`${API_BASE_URL}/user/smart-profile`, {
        data: {
          onboardingData: answers,
        }, smartProfile: parsedUserOrbisData?.data?.smartProfile
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-profile-type-stream-id': profileTypeStreamId,
          'x-client-app-id': clientId,
        },
        validateStatus: () => true,
      })
      console.log("Response", response)
      if (response.status === 200) {
        const { smartProfile } = response.data
        await updatePublicSmartProfileAction(profileTypeStreamId, smartProfile)
        postResponse()
      } else {
        postResponse()
      }
    } catch (err) {
      console.log("Some Error:", err)
      postResponse()
    } finally {
      setLoading(false)
    }
  }

  const isAnswerValid = () => {
    const answerData = answers[currentStep1]?.answer; // Ensure answer is correctly accesse

    switch (currentQuestion.type) {
      case "SIMPLE_QUESTION":
        return typeof answerData === "string" && answerData.trim().length > 0;

      case "MULTICHOICE_QUESTION":
        return typeof answerData === "string" && answerData !== "Select option";

      case "CATEGORY_QUESTION":
        return typeof answerData === "object" && Object.keys(answerData).length > 0;

      default:
        return true;
    }
  };

  const renderQuestionContent = () => {
    switch (currentQuestion.type) {
      case "SIMPLE_QUESTION":
        return (
          <StyledInput
            placeholder="Type your answer here"
            value={answers[currentStep1]?.answer as string}
            onChange={handleTextChange}
          />
        )

      case "MULTICHOICE_QUESTION":
        return (
          <StyledSelect
            placeholder="Select an option"
            value={answers[currentStep1]?.answer as string}
            onChange={handleMultiChoiceChange}
            isIframe = {window.location !== window.parent.location}
          >
            {currentQuestion.options?.map((option: { text: string }, i: number) => (
              <Select.Option key={i} value={option.text}>
                {option.text}
              </Select.Option>
            ))}
          </StyledSelect>
        )


      case "CATEGORY_QUESTION":
        return (
          <TagsContainer ref={tagsContainerRef}>
            <ScrollableTagsSection>
              {currentQuestion.tagGroups?.map((group: Tags) => (
                <div key={group.category}>
                  <CategoryTitle>{group.category}</CategoryTitle>
                  <TagsWrapper>
                    {group.tags.map((tag) => (
                      <StyledTag
                        key={tag}
                        selected={isTagSelected(group.category, tag)}
                        onClick={() => handleTagToggle(group.category, tag)}
                      >
                        {tag}
                      </StyledTag>
                    ))}
                  </TagsWrapper>
                </div>
              ))}
            </ScrollableTagsSection>
          </TagsContainer>
        )

      default:
        return null
    }
  }

  return (
    <Container>
      <Card>
        <Header questionType={currentQuestion.type}>
          <Title>Profile Setup</Title>
          <ProgressBarContainer>
            <ProgressBar>
              <Progress progress={progress} />
            </ProgressBar>
          </ProgressBarContainer>
        </Header>

        <Content questionType={currentQuestion.type}>
          {currentQuestion.type !== 'CATEGORY_QUESTION' ?
            <p className="text-[#6b7280] mb-6">Question {currentStep1 + 1} of {totalSteps}</p>
            : null}
          <Question>{currentQuestion.question}</Question>
          <Subtitle>{currentQuestion.supportingText || ""}</Subtitle>
          {renderQuestionContent()}
        </Content>

        <ButtonContainer type={currentQuestion.type}>
          <CustomButton
            text={currentStep1 === totalSteps - 1 ? "Finish" : "Next"}
            minWidth="390px"
            isDisable={!isAnswerValid()}
            handleClick={handleNext}
            loader={loading}
          />
          {<BackButton onClick={handleBack}>Back</BackButton>}
        </ButtonContainer>
      </Card>
    </Container>
  )
}

export default OnboardingForm