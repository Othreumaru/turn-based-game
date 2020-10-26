export type Stages = 'load-resources-stage' | 'team-stage' | 'battle-stage';

export interface StageSwitch {
  stage: Stages;
}
