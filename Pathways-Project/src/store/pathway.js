import * as assert from 'assert'
import * as _ from 'lodash'
// Actions
const PATHWAY_LOADING_SUCCESS = 'pathways/pathway/PATHWAY_LOADING_SUCCESS'
const PATHWAY_ADD_NODE = 'pathways/pathway/PATHWAY_ADD_NODE'
const PATHWAY_DELETE_NODE = 'pathways/pathway/PATHWAY_DELETE_NODE'
const SIDEBAR_CREATE = 'pathways/pathway/SIDEBAR_CREATE'
const SIDEBAR_VIEW_NODE = 'pathways/pathway/SIDEBAR_VIEW_NODE'
const SIDEBAR_VIEW_NONE = 'pathways/pathway/SIDEBAR_VIEW_NONE'
const ERROR = 'pathways/pathway/ERROR'
const CHANGE_LOAD_STATE = 'pathways/pathway/CHANGE_LOAD_STATE'

// Action creators
export function changeLoadState (state) {
  assert(state in loadingStateEnum, 'State not in enum')
  return {
    type: CHANGE_LOAD_STATE,
    state
  }
}

export function loadUserPathway () {
  return async (dispatch, getState) => {
    dispatch(changeLoadState(loadingStateEnum.DURING_LOAD))

    const fetchResult = await fetch('/api/v1/user/pathway')

    if (!fetchResult.ok) {
      return dispatch({ type: ERROR, message: await fetchResult.text() })
    }

    const data = await fetchResult.json()
    dispatch({ type: PATHWAY_LOADING_SUCCESS, pathway: data.pathway })
  }
}

export function sidebarSwitchToCreate () {
  return { type: SIDEBAR_CREATE }
}

export function sidebarSwitchToViewNode (nodeId) {
  return { type: SIDEBAR_VIEW_NODE, nodeId }
}

export function sidebarSwitchToDefault () {
  return { type: SIDEBAR_VIEW_NONE }
}

export function uploadPathToServer () {
  return async (dispatch, getState) => {
    const state = getState()
    dispatch(changeLoadState(loadingStateEnum.DURING_RELOAD))
    const options = {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ pathway: state.pathway.pathway })
    }
    const fetchResult = await fetch('/api/v1/user/pathway', options)
    if (!fetchResult.ok) {
      dispatch({ type: ERROR, message: await fetchResult.text() })
    }
    dispatch(changeLoadState(loadingStateEnum.AFTER_RELOAD))
  }
}

export function saveNodeToPathway (grade, courses) {
  return async (dispatch) => {
    const event = {
      type: PATHWAY_ADD_NODE,
      grade,
      courses
    }
    dispatch(event)
    try {
      await dispatch(uploadPathToServer())
    } catch (e) {
      return dispatch({ type: ERROR, message: e.message })
    }

    dispatch(sidebarSwitchToViewNode(grade))
  }
}

export function deleteNodeFromPathway (grade) {
  return async (dispatch) => {
    dispatch(sidebarSwitchToDefault())

    const event = {
      type: PATHWAY_DELETE_NODE,
      grade
    }

    dispatch(event)
    try {
      await dispatch(uploadPathToServer())
    } catch (e) {
      return dispatch({ type: ERROR, message: e.message })
    }
  }
}

// Enums
export const loadingStateEnum = Object.freeze({
  BEFORE_LOAD: 'BEFORE_LOAD',
  DURING_LOAD: 'DURING_LOAD',
  AFTER_LOAD: 'AFTER_LOAD',
  FAILED_LOAD: 'FAILED_LOAD',
  DURING_RELOAD: 'DURING_RELOAD',
  AFTER_RELOAD: 'AFTER_RELOAD',
  FAILED_RELOAD: 'FAILED_RELOAD'
})

export const sidebarModeEnum = Object.freeze({
  CREATE: 'create',
  VIEW: 'view',
  NONE: 'none'
})

// Default state
const defaultState = {
  pathway: {
    9: [],
    10: []
  },
  loading: loadingStateEnum.BEFORE_LOAD,
  sidebar: {
    type: sidebarModeEnum.NONE
  },
  error: null
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case PATHWAY_LOADING_SUCCESS:
      return { ...state, pathway: action.pathway, loading: loadingStateEnum.AFTER_LOAD }
    case SIDEBAR_CREATE:
      return { ...state, sidebar: { type: sidebarModeEnum.CREATE } }
    case SIDEBAR_VIEW_NODE:
      return { ...state, sidebar: { type: sidebarModeEnum.VIEW, nodeId: action.nodeId } }
    case SIDEBAR_VIEW_NONE:
      return { ...state, sidebar: { type: sidebarModeEnum.NONE } }
    case PATHWAY_ADD_NODE:
      return { ...state, pathway: { ...state.pathway, [action.grade]: action.courses } }
    case PATHWAY_DELETE_NODE:
      return { ...state, pathway: _.omit(state.pathway, action.grade) }
    case CHANGE_LOAD_STATE:
      return { ...state, loading: action.state }
    case ERROR:
      return { ...state, error: action.message }
    default: return state
  }
}
