# frozen_string_literal: true
class Course::Forum::Controller < Course::ComponentController
  helper Course::Forum::ControllerHelper
  before_action :load_forum, unless: :skip_load_forum?
  authorize_resource :forum, class: Course::Forum.name
  before_action :add_forum_breadcrumb

  private

  def load_forum
    @forum ||= current_course.forums.friendly.find(params[:forum_id] || params[:id])
  end

  def add_forum_breadcrumb
    add_breadcrumb component.settings.title || t('breadcrumbs.course.forum.forums.index'),
                   :course_forums_path
  end

  # @return [Course::ForumsComponent] The forum component.
  # @return [nil] If component is disabled.
  def component
    current_component_host[:course_forums_component]
  end

  def skip_load_forum?
    false
  end
end
