<?php

namespace Drupal\user_activity_logger\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Url;
use Drupal\node\Entity\NodeType;
use Drupal\Core\Session\AccountInterface;

/**
 * Provides a 'Permission Based Dashboard' block.
 *
 * @Block(
 *   id = "permission_based_dashboard",
 *   admin_label = @Translation("Permission Based Dashboard")
 * )
 */
class ContentActionLinksBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $account = \Drupal::currentUser();
    $links = [];

    // Get all content types.
    $types = NodeType::loadMultiple();

    foreach ($types as $type_id => $type) {
      $type_label = $type->label();

      // Define the actions and permissions.
      $actions = [
        'Create' => "create {$type_id} content",
        'Edit any' => "edit any {$type_id} content",
        'Delete any' => "delete any {$type_id} content",
        'View revisions' => "view {$type_id} revisions",
      ];

      foreach ($actions as $label => $permission) {
        if ($account->hasPermission($permission)) {
          $url = $this->getActionUrl($type_id, $label);
          if ($url) {
            $links[] = [
              'title' => "{$type_label}: {$label}",
              'url' => $url->toString(),
            ];
          }
        }
      }
    }

    return [
      '#theme' => 'item_list',
      '#items' => array_map(function ($link) {
        return [
          '#markup' => '<a href="' . $link['url'] . '">' . $link['title'] . '</a>',
        ];
      }, $links),
      '#cache' => ['contexts' => ['user.permissions']],
    ];
  }

  /**
   * Get URL for action.
   */
  private function getActionUrl($type_id, $action) {
    switch ($action) {
      case 'Create':
        return Url::fromRoute('node.add', ['node_type' => $type_id]);

      case 'Edit any':
        // Link to content overview filtered by type.
        return Url::fromRoute('system.admin_content', [], ['query' => ['type' => $type_id]]);

      case 'Delete any':
        return Url::fromRoute('system.admin_content', [], ['query' => ['type' => $type_id]]);

      case 'View revisions':
        // No generic route; handled per-node.
        return NULL;
    } 
    return NULL;
  }
}
