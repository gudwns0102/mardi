import _ from "lodash";
import { flow, types } from "mobx-state-tree";

import {
  getDefaultQuestionsAPI,
  getFreeQuestionTextAPI,
  getQuestionCuraiontsAPI,
  getQuestionsAPI,
  postDefaultQuestionClickAPI,
  postQuestionPlayAPI
} from "src/apis";
import {
  getRandomBackgroundIndex,
  getRandomPatternIndex
} from "src/utils/ContentPattern";

export interface IQuestionWithStyle extends IQuestion {
  default_image_color_idx: number;
  default_image_pattern_idx: number;
}

export interface IDefaultQuestion {
  id: number;
  text: string;
  num_clicked: number;
  created_at: string;
}

export const QuestionStore = types
  .model({
    questions: types.optional(
      types.map(types.frozen<IQuestionWithStyle>()),
      {}
    ),
    defaultQuestions: types.optional(
      types.map(types.frozen<IDefaultQuestion>()),
      {}
    ),
    curations: types.optional(types.map(types.frozen<ICuration>()), {})
  })
  .actions(self => {
    const getFreeQuestionTextArray = flow(function*() {
      const {
        default_questions
      }: RetrieveAsyncFunc<
        typeof getFreeQuestionTextAPI
      > = yield getFreeQuestionTextAPI();
      return default_questions;
    });

    const fetchDefaultQuestions = flow(function*() {
      const response: RetrieveAsyncFunc<
        typeof getDefaultQuestionsAPI
      > = yield getDefaultQuestionsAPI();

      response.forEach(defaultQuestion =>
        self.defaultQuestions.set(
          defaultQuestion.id.toString(),
          defaultQuestion
        )
      );

      return;
    });

    const fetchQuestions = flow(function*() {
      try {
        const questions: RetrieveAsyncFunc<
          typeof getQuestionsAPI
        > = yield getQuestionsAPI();

        questions.forEach(question => {
          self.questions.set(question.id.toString(), {
            ...question,
            default_image_color_idx: getRandomBackgroundIndex(),
            default_image_pattern_idx: getRandomPatternIndex()
          });
        });

        return true;
      } catch (error) {
        return false;
      }
    });

    const fetchCurations = flow(function*() {
      const response: RetrieveAsyncFunc<
        typeof getQuestionCuraiontsAPI
      > = yield getQuestionCuraiontsAPI();

      response.map(curation =>
        self.curations.set(curation.id.toString(), curation)
      );
    });

    const changeQuestionsStyle = () => {
      self.questions.forEach(question => {
        self.questions.set(question.id.toString(), {
          ...question,
          default_image_color_idx: getRandomBackgroundIndex(),
          default_image_pattern_idx: getRandomPatternIndex()
        });
      });
    };

    const countQuestionPlayPress = (questionId: IQuestion["id"]) => {
      postQuestionPlayAPI(questionId);
    };

    const countDefaultQuestionPress = (id: IDefaultQuestion["id"]) => {
      postDefaultQuestionClickAPI(id);
    };

    return {
      getFreeQuestionTextArray,
      fetchDefaultQuestions,
      fetchQuestions,
      fetchCurations,
      changeQuestionsStyle,
      countQuestionPlayPress,
      countDefaultQuestionPress
    };
  });

export type IQuestionStore = typeof QuestionStore.Type;
