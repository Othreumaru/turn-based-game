export type Stages = 'load-resources-stage' | 'team-stage' | 'battle-stage' | 'board-stage';

export interface StageSwitch {
  stage: Stages;
}
