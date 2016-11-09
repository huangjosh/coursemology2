# frozen_string_literal: true
module Course::LessonPlanAbilityComponent
  include AbilityHost::Component

  def define_permissions
    if user
      allow_registered_users_showing_milestones_items
      allow_course_staff_manage_lesson_plans
      allow_own_users_to_ignore_own_todos
    end

    super
  end

  private

  def allow_registered_users_showing_milestones_items
    can :read, Course::LessonPlan::Milestone, course_all_course_users_hash
    can :read, Course::LessonPlan::Item, course_all_course_users_hash.merge(draft: false)
    can :read, Course::LessonPlan::Event, lesson_plan_item: course_all_course_users_hash
  end

  def allow_course_staff_manage_lesson_plans
    can :manage, Course::LessonPlan::Milestone, course_staff_hash
    can :manage, Course::LessonPlan::Item, course_staff_hash
    can :manage, Course::LessonPlan::Event, lesson_plan_item: course_staff_hash
  end

  def allow_own_users_to_ignore_own_todos
    can :ignore, Course::LessonPlan::Todo, user_id: user.id
  end
end
