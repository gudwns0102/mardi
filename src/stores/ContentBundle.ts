import { flow, types } from "mobx-state-tree";

import {
  getContentAPI,
  getContentsAPI,
  getFollowerContentsAPI,
  getHomeContentsAPI,
  getTop30Contents,
  IContentParams
} from "src/apis";

export type ContentBundleType = "ALL" | "FOLLOWED" | "HOME" | "TOP30";

const INITIAL_PAGE = 1;
const DEFAULT_PAGE_SIZE = 15;

const ContentBundle = types
  .model({
    contents: types.optional(types.map(types.frozen<IContent>()), {}),
    count: types.optional(types.number, 0),
    page: types.optional(types.number, INITIAL_PAGE),
    reachEnd: types.optional(types.boolean, false),
    isFetching: types.optional(types.boolean, false),
    refreshing: types.optional(types.boolean, false),
    type: types.optional(types.frozen<ContentBundleType>(), "ALL")
  })
  .volatile(_ => ({
    params: {
      user: undefined as undefined | IUser["uuid"],
      question: undefined as undefined | IQuestion["id"],
      search: undefined as undefined | string,
      famous: undefined as undefined | boolean
    } as IContentParams
  }))
  .views(self => {
    return {
      get contentArray() {
        return Array.from(self.contents.values());
      },

      get sortType(): ContentSortType {
        const { famous } = self.params;
        return famous === true ? "TREND" : "LATEST";
      },

      get api() {
        return {
          ALL: getContentsAPI,
          FOLLOWED: getFollowerContentsAPI,
          HOME: getHomeContentsAPI,
          TOP30: getTop30Contents
        }[self.type];
      },

      get isFirstFetching() {
        return self.isFetching && self.contents.size === 0;
      },

      get hasNoResult() {
        return self.reachEnd && self.contents.size === 0;
      }
    };
  })
  .actions(self => {
    const clearContents = () => {
      self.contents.clear();
    };

    const clearPage = () => {
      self.page = INITIAL_PAGE;
      self.reachEnd = false;
    };

    const fetchContents = flow(function*() {
      if (self.reachEnd || self.isFetching) {
        return [];
      }

      self.isFetching = true;

      const data: { page: number; page_size: number } = {
        page: self.page,
        page_size: DEFAULT_PAGE_SIZE
      };

      try {
        const api = self.api;
        const {
          count,
          next,
          results: contents
        }: RetrieveAsyncFunc<typeof api> = yield api({
          ...data,
          ...self.params
        });

        self.count = count;
        self.page += 1;
        self.reachEnd = next === null;
        self.isFetching = false;

        return contents || [];
      } catch (error) {
        self.isFetching = false;
        return [];
      }
    });

    const updateContents = (contents: IContent[]) => {
      contents.forEach(content =>
        self.contents.set(content.id.toString(), content)
      );
    };

    const initializeContent = flow(function*(contentId: IContent["id"]) {
      if (self.isFetching) {
        return;
      }

      clearContents();
      clearPage();

      const content: RetrieveAsyncFunc<
        typeof getContentAPI
      > = yield getContentAPI(contentId);

      if (!content) {
        throw new Error("컨텐츠를 조회할 수 없습니다.");
      }

      self.contents.set(content.id.toString(), content);
    });

    const initializeContents = flow(function*(
      params?: IContentParams,
      type?: ContentBundleType
    ) {
      if (params) {
        self.params = { ...params };
      }

      self.type = type || "ALL";

      clearPage();
      clearContents();
      const contents: IContent[] = yield fetchContents();
      updateContents(contents);
    });

    const refreshContents = flow(function*() {
      if (self.refreshing) {
        return;
      }

      try {
        self.refreshing = true;
        clearPage();
        const contents: IContent[] = yield fetchContents();
        clearContents();
        updateContents(contents);
      } finally {
        self.refreshing = false;
      }
    });

    const appendContents = flow(function*() {
      const contents: IContent[] = yield fetchContents();
      updateContents(contents);
    });

    const updateContentIfExist = (
      contentId: IContent["id"],
      contentData: Partial<IContent>
    ) => {
      const content = self.contents.get(contentId.toString());

      if (!content) {
        return;
      }

      self.contents.set(contentId.toString(), { ...content, ...contentData });
    };

    const initializeLatestContents = (params?: IContentParams) => {
      return initializeContents({ ...params, famous: false });
    };

    const initializeTrendContents = (params?: IContentParams) => {
      return initializeContents({ ...params, famous: true });
    };

    return {
      clearContents,
      initializeContent,
      initializeContents,
      appendContents,
      refreshContents,
      updateContentIfExist,
      initializeLatestContents,
      initializeTrendContents
    };
  });

export type IContentBundle = typeof ContentBundle.Type;

export default ContentBundle;
