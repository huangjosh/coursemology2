FactoryGirl.define do
  factory :course_user_invitation, class: Course::UserInvitation do
    transient do
      course nil
      user nil
    end

    course_user do
      options = { workflow_state: :invited }
      options[:course] = course if course
      build(:course_user, options)
    end
    user_email { build(:user_email, user: user) }
    creator
    updater

    after(:create) do |invitation|
      invitation.course_user.save!
      invitation.user_email.save!
    end
  end
end