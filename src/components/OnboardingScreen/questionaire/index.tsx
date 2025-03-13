import { useState } from "react"
import { Input, Select, Tag } from "antd"
import styled from "styled-components"
import CustomButton from "../../customButton"
import { useStepper } from "../../../hooks/useStepper"
import { ONBOARDING_QUESTIONS } from "../../../utils/Constants"

interface Answers {
  0: string;
  1: string;
  2: {
    technologies: string[];
    health: string[];
    culture: string[];
  };
}

interface Question {
  questionType: string;
  placeholder?: string;
  options?: string[];
  technologies?: string[];
  health?: string[];
  culture?: string[];
  question: string;
  questionDescription: string;
}

const Container = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  max-height: 600px;
`

const Card = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  border-radius: 24px;
  min-height: 500px;
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

const Progress = styled.div<{progress: number}>`
  height: 100%;
  width: ${({progress}) => progress}%;
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

// Remove overflow-y: auto from Content
const Content = styled.div<{ questionType: string }>`
  padding: 16px;
  gap: 8px;
  margin-top: ${({ questionType }) => (questionType === "tags" ? "0" : "70px")};
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

const StyledSelect = styled(Select)`
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

// Add a scrollable container specifically for the categories
const TagsContainer = styled.div`
  margin-top: 16px;
    max-height: 250px;
  overflow-y: auto;
`

// Make the categories section scrollable
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

const StyledTag = styled(Tag)<{selected: boolean}>`
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  margin-right: 0;
  background-color: ${({ selected }) => (selected ? "#333" : "#f0f0f0")};
  color: ${({ selected }) => (selected  ? "white" : "#333")};
  border: none;
  
  &:hover {
    opacity: 0.9;
  }
`
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const OnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const {goToStep} = useStepper()
  const [answers, setAnswers] = useState<Answers>({
    0: "",
    1: "",
    2: {
      technologies: [],
      health: [],
      culture: [],
    },
  })

  const totalSteps = ONBOARDING_QUESTIONS.length
  const currentQuestion = ONBOARDING_QUESTIONS[currentStep]
  const progress = ((currentStep + 1) / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      goToStep('socialConnect')
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

 

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswers({
      ...answers,
      [currentStep]: e.target.value,
    });
  };

  const handleDropdownChange = (value: unknown) => {
    setAnswers({
      ...answers,
      [currentStep]: value as string,
    })
  }

  const handleTagToggle = (category: 'technologies' | 'health' | 'culture', tag: string) => {
    const currentTags = [...answers[2][category]]
    const tagIndex = currentTags.indexOf(tag)

    if (tagIndex === -1) {
      currentTags.push(tag)
    } else {
      currentTags.splice(tagIndex, 1)
    }

    setAnswers({
      ...answers,
      2: {
        ...answers[2],
        [category]: currentTags,
      },
    })
  }

  const renderQuestionContent = () => {
    switch (currentQuestion.questionType) {
      case "text":
        return (
          <StyledInput
            placeholder={currentQuestion.placeholder}
            value={answers[currentStep]}
            onChange={handleTextChange}
          />
        )

      case "dropdown":
        return (
          <StyledSelect
            placeholder={currentQuestion.placeholder}
            value={answers[currentStep] || undefined}
            onChange={handleDropdownChange}
          >
            {currentQuestion && currentQuestion?.options?.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </StyledSelect>
        )

      case "tags":
        return (
          <TagsContainer>
            {/* Only the categories section is scrollable */}
            <ScrollableTagsSection>
              <CategoryTitle>Technologies</CategoryTitle>
              <TagsWrapper>
                {currentQuestion && currentQuestion?.technologies?.map((tag) => (
                  <StyledTag
                    key={tag}
                    selected={answers[2].technologies.includes(tag)}
                    onClick={() => handleTagToggle("technologies", tag)}
                  >
                    {tag}
                  </StyledTag>
                ))}
              </TagsWrapper>

              <CategoryTitle>Health</CategoryTitle>
              <TagsWrapper>
                {currentQuestion && currentQuestion?.health?.map((tag) => (
                  <StyledTag
                    key={tag}
                    selected={answers[2].health.includes(tag)}
                    onClick={() => handleTagToggle("health", tag)}
                  >
                    {tag}
                  </StyledTag>
                ))}
              </TagsWrapper>

              <CategoryTitle>Culture</CategoryTitle>
              <TagsWrapper>
                {currentQuestion && currentQuestion?.culture?.map((tag) => (
                  <StyledTag
                    key={tag}
                    selected={answers[2].culture.includes(tag)}
                    onClick={() => handleTagToggle("culture", tag)}
                  >
                    {tag}
                  </StyledTag>
                ))}
              </TagsWrapper>
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
        <Header questionType={currentQuestion.questionType}>
          <Title>Profile Setup</Title>
          <ProgressBarContainer>
            <ProgressBar>
              <Progress progress={progress} />
            </ProgressBar>
          </ProgressBarContainer>
        </Header>

        <Content questionType={currentQuestion.questionType}>
          <Question>{currentQuestion.question}</Question>
          <Subtitle>{currentQuestion.questionDescription}</Subtitle>
          {renderQuestionContent()}
        </Content>

        <ButtonContainer>
          <CustomButton
            text={currentStep === totalSteps - 1 ? "Finish" : "Next"}
            minWidth="390px"
            handleClick={handleNext}
          />
          {<BackButton onClick={handleBack}>Back</BackButton>}
        </ButtonContainer>
      </Card>
    </Container>
  )
}

export default OnboardingForm